import { getXataClient } from '@/lib/xata'
import { auth } from '@clerk/nextjs/server'
import { libAccessStatusMap } from './config'

export const authWrite = async (lib: string, ownerOnly?: boolean) => {
    const xata = getXataClient()
    const { userId, orgId, orgRole } = auth()
    if (!userId) {
        throw new Error('Write unauthorized')
    }
    const orgCondition = orgId && orgRole === 'org:admin' ? [{ org: orgId }] : []
    const rec = await xata.db.libraries.select(['owner', 'language']).filter({
        $all: [
            { id: lib },
            !ownerOnly ? {
                $any: [
                    { collaborators: { $includes: userId } },
                    { collaborators: { $includes: '*' } },
                    { owner: userId },
                    // @ts-ignore
                ].concat(orgCondition)
                // @ts-ignore
            } : { $any: [{ owner: userId }].concat(orgCondition) },
        ]
    }).getFirst()
    if (!rec) {
        throw new Error('Write unauthorized')
    }
    return rec
}

export const authRead = async (lib: string) => {
    const xata = getXataClient()
    const { userId, orgId, orgRole } = auth()
    if (!userId) {
        throw new Error('Read unauthorized')
    }
    const rec = await xata.db.libraries.select(['owner', 'language', 'name', 'starredBy', 'collaborators', 'org']).filter({
        $all: [
            { id: lib },
            {
                $any: [
                    { collaborators: { $includes: userId } },
                    { collaborators: { $includes: '*' } },
                    { owner: userId },
                    { viewers: { $includes: userId } },
                    { viewers: { $includes: '*' } },
                    { access: libAccessStatusMap.public },
                    { org: orgId }
                ]
            },
        ]
    }).getFirst()
    if (!rec) {
        throw new Error('Read unauthorized')
    }
    const isReadOnly = !rec?.collaborators?.includes(userId as string) && !rec?.collaborators?.includes('*') && rec?.owner !== auth().userId && (orgId !== '' && rec?.org === orgId ? orgRole !== 'org:admin' : true)
    const isOwner = rec?.owner === auth().userId
    return { rec, isReadOnly, isOwner }
}

export const authAccess = async (lib: string, otherwise?: () => void) => {
    const xata = getXataClient()
    const { userId, orgId, orgRole } = auth()
    if (!userId) {
        throw new Error('Read unauthorized')
    }
    const rec = await xata
        .db
        .libraries
        .select(['owner', 'language', 'name', 'starredBy', 'collaborators', 'viewers', 'access', 'org'])
        .filter({ id: lib }).getFirst()
    if (!rec) {
        throw new Error('Library not found')
    }

    const isAccessible = rec?.collaborators?.includes(userId as string) || rec?.collaborators?.includes('*') || rec?.owner === userId || rec?.viewers?.includes(userId as string) || rec?.viewers?.includes('*') || rec?.access === libAccessStatusMap.public || (Boolean(orgId) && rec?.org === orgId)
    if (!isAccessible && otherwise) {
        otherwise()
    }
    const isReadOnly = isAccessible && (!rec?.collaborators?.includes(userId as string) && !rec?.collaborators?.includes('*') && rec?.owner !== auth().userId && (orgId !== '' && rec?.org === orgId ? orgRole !== 'org:admin' : true))
    const isPrivate = rec?.access === libAccessStatusMap.private
    const isOrgnizational = orgId !== '' && rec?.org === orgId
    return { rec, isAccessible, isReadOnly, isPrivate, isOrgnizational }
}

const belongToOwnLibs = () => {
    const { userId } = auth()
    return {
        $any: [
            {
                'lib.owner': userId,
                $notExists: 'lib.org'
            },
            {
                $all: [
                    { 'lib.starredBy': { $includes: userId } },
                    {
                        $any: [
                            { 'lib.collaborators': { $includes: userId } },
                            { 'lib.collaborators': { $includes: '*' } },
                            { 'lib.viewers': { $includes: userId } },
                            { 'lib.viewers': { $includes: '*' } }
                        ]
                    }]
            }
        ]
    }
}

export const belongsToListedLibs = () => {
    const { orgId } = auth()
    return orgId ? {
        'lib.org': orgId,
    } : belongToOwnLibs()
}

export const belongsToAnyUserLibs = () => {
    const { userId, orgId } = auth()
    return {
        $any: [
            belongToOwnLibs(),
            orgId ? {
                'lib.org': orgId,
            } : {},
            { 'lib.owner': userId, }
        ]
    }
}
