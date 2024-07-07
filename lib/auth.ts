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
    const rec = await xata.db.libraries.select(['owner', 'language', 'name', 'starredBy', 'org']).filter({
        $all: [
            { id: lib },
            {
                $any: [
                    { owner: userId },
                    { access: libAccessStatusMap.public },
                    { org: orgId }
                ]
            },
        ]
    }).getFirst()
    if (!rec) {
        throw new Error('Read unauthorized')
    }
    const isReadOnly = (orgId !== '' && rec?.org === orgId ? orgRole !== 'org:admin' : true)
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
        .select(['owner', 'language', 'name', 'starredBy', 'access', 'org'])
        .filter({ id: lib }).getFirst()
    if (!rec) {
        throw new Error('Library not found')
    }

    const isAccessible = rec?.access === libAccessStatusMap.public || (Boolean(orgId) && rec?.org === orgId)
    if (!isAccessible && otherwise) {
        otherwise()
    }
    const isReadOnly = isAccessible && (orgId !== '' && rec?.org === orgId ? orgRole !== 'org:admin' : true)
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
                'lib.starredBy': { $includes: userId }
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
