'use server'

import { authWrite } from '@/lib/auth'
import { ApplicationStatus } from '@/lib/config'
import { getXataClient } from '@/lib/xata'
import { auth } from '@clerk/nextjs/server'

export default async function loadApplications(cursor?: string) {
    const xata = getXataClient()
    const { orgId, orgRole, userId } = auth()
    const res = await xata
        .db
        .applications
        .filter({
            $any: [
                { 'lib.owner': userId as string },
                // @ts-ignore
            ].concat(orgId && orgRole === 'org:admin' ? [{ 'lib.org': orgId }] : [])
        })
        .sort('xata.updatedAt', 'desc').select(['access', 'applicant', 'lib.name', 'note', 'status'])
        .getPaginated({
            pagination: { size: 10, after: cursor },
        })
    return { applications: res.records, cursor: res.meta.page.cursor, more: res.meta.page.more }
}

export async function countUnreadApplications() {
    const xata = getXataClient()
    const { userId, orgId, orgRole } = auth()
    const { summaries } = await xata
        .db
        .applications
        .filter({
            $all: [
                {
                    $any: [
                        { 'lib.owner': userId as string },
                        // @ts-ignore
                    ].concat(orgId && orgRole === 'org:admin' ? [{ 'lib.org': orgId }] : [])
                },
                { status: ApplicationStatus.Pending }
            ]
        })
        .summarize({
            summaries: {
                count: { count: '*' },
            },
        })
    return summaries[0].count
}

export async function approveApplication(id: string, libId: string, access: string, applicant: string) {
    const xata = getXataClient()
    authWrite(libId)
    const lib = await xata.db.libraries.select(['viewers', 'collaborators', 'starredBy']).filter({ id: libId }).getFirst()
    await xata.transactions.run([
        {
            update:
                { table: 'applications', id, fields: { status: ApplicationStatus.Approved } },
        }, {
            update:
            {
                table: 'libraries', id: libId, fields: Object.assign(access === 'read' ? {
                    viewers: [...(lib!.viewers ?? []), applicant],
                } : {
                    collaborators: [...(lib!.collaborators ?? []), applicant],
                }, {
                    starredBy: [...(lib!.starredBy ?? []), applicant],
                })
            }
        },
    ])
}

export async function rejectApplication(id: string) {
    const xata = getXataClient()
    await xata.db.applications.update(id, { status: ApplicationStatus.Rejected })
}
