import { auth, currentUser } from '@clerk/nextjs/server'
import NavBreadcrumbs from './breadcrumbs'

export type NavProps = {
    lib?: {
        id: string
        name: string
    }
    text?: {
        id: string
        name: string
    }
}

export default async function Nav(props: NavProps) {
    const { orgSlug } = auth()
    const tenant = orgSlug ?? (await currentUser())?.username ?? '用户'
    return <NavBreadcrumbs {...props} tenant={tenant}></NavBreadcrumbs>
}
