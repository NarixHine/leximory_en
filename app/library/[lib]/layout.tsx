import { authAccess } from '@/lib/auth'
import { auth } from '@clerk/nextjs/server'
import Prompt from './prompt'
import { getXataClient } from '@/lib/xata'
import { redirect } from 'next/navigation'
import LibAside from './aside'

export async function generateMetadata({ params }: LibParams) {
	const xata = getXataClient()
	const rec = await xata.db.libraries.read(params.lib)
	return {
		title: {
			default: rec!.name,
			template: `%s | ${rec!.name} | Leximory`
		}
	}
}

export default async function LibLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { lib: string }
}) {
	const { rec, isReadOnly, isOrgnizational } = await authAccess(params.lib, () => redirect(`/apply/${params.lib}`))
	const { owner, starredBy } = rec
	const { userId } = auth()
	const isOwner = owner === userId
	const isStarred = starredBy?.includes(userId as string) ?? false
	return (<>
		<Prompt isReadOnly={isReadOnly} isOwner={isOwner} isStarred={isStarred} isOrganizational={isOrgnizational}></Prompt>
		{children}
		<LibAside lib={params.lib} lang={rec.language} isOwner={isOwner} isStarred={isStarred} isReadOnly={isReadOnly}></LibAside>
	</>)
}
