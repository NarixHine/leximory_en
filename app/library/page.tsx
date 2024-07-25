import { CommentaryQuotaCard, AudioQuotaCard } from '@/components/cards'
import GradientCard from '@/components/cards/card'
import DailyCard from '@/components/daily'
import Library from '@/components/library'
import Lookback, { LookbackWrapper } from '@/components/lookback'
import Main from '@/components/main'
import Nav from '@/components/nav'
import Options from '@/components/options'
import H from '@/components/title'
import { authWrite, belongsToListedLibs } from '@/lib/auth'
import { supportedLangs, langMap, welcomeMap, libAccessStatusMap, accessOptions } from '@/lib/config'
import { randomID } from '@/lib/utils'
import { getXataClient } from '@/lib/xata'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Button } from '@nextui-org/button'
import { Skeleton } from '@nextui-org/skeleton'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Libraries'
}

async function getData() {
    const xata = getXataClient()
    const data = await xata.db.lexicon.filter(belongsToListedLibs()).summarize({
        columns: ['lib'],
        summaries: {
            count: { count: '*' },
        },
    })
    return data
}

async function getOrgs() {
    const { data } = await clerkClient.users.getOrganizationMembershipList({ userId: auth().userId! })
    return data
}

export default async function Page() {
    const [{ summaries }, mems] = await Promise.all([getData(), getOrgs()])
    const { userId, orgId } = auth()
    const save = async (id: string, form: FormData) => {
        'use server'
        const xata = getXataClient()
        const lang = form.get('lang') as string | undefined
        const access = form.get('access') as string
        const col = {
            collaborators: ((form.get('collaborators') ?? '') as string).split('\n').filter(Boolean),
            viewers: ((form.get('viewers') ?? '') as string).split('\n').filter(Boolean),
        }
        if (lang) {
            const lib = await xata.db.libraries.create({
                id,
                owner: userId as string,
                name: form.get('name') as string,
                language: lang as string,
                access: libAccessStatusMap[access],
                org: orgId,
                ...col,
            })
            await xata.db.lexicon.create({
                lib,
                word: welcomeMap[lang],
            })
        }
        else {
            await authWrite(id, true)
            const org = form.get('org')
            // @ts-ignore
            await xata.db.libraries.update(id, typeof org === 'string'
                ? {
                    org: form.get('org') === 'none' ? null : form.get('org'),
                    ...col,
                    name: form.get('name') as string,
                    access: libAccessStatusMap[access],
                } : {
                    name: form.get('name') as string,
                    access: libAccessStatusMap[access],
                })
        }
        revalidatePath('/library')
    }
    const del = async (id: string) => {
        'use server'
        const xata = getXataClient()
        await authWrite(id)
        const [texts, words, audios] = await Promise.all([
            xata.db.texts.filter({ lib: id }).getAll(),
            xata.db.lexicon.filter({ lib: id }).getAll(),
            xata.db.audio.filter({ lib: id }).getAll(),
        ])
        await xata.transactions.run([
            { delete: { id, table: 'libraries' } },
            ...texts.map(({ id }) => ({
                delete: {
                    id,
                    table: 'texts' as 'texts'
                }
            })),
            ...words.map(({ id }) => ({
                delete: {
                    id,
                    table: 'lexicon' as 'lexicon'
                }
            })),
            ...audios.map(({ id }) => ({
                delete: {
                    id,
                    table: 'audio' as 'audio'
                }
            })),
        ])
        revalidatePath('/library')
    }

    return <Main className='flex flex-col gap-10'>
        <Nav></Nav>
        <H>Library</H>
        <DailyCard></DailyCard>
        <div className='grid grid-cols-1 justify-center -mt-6'>
            <Suspense fallback={<GradientCard></GradientCard>}>
                <CommentaryQuotaCard />
            </Suspense>
        </div>
        <Suspense fallback={<LookbackWrapper>
            <Skeleton disableAnimation className='animate-pulse w-full my-3 h-2'></Skeleton>
        </LookbackWrapper>}>
            <Lookback></Lookback>
        </Suspense>
        {summaries.map(({ lib, count }) => (
            <Library
                del={del.bind(null, lib!.id)}
                save={save.bind(null, lib!.id)}
                access={lib!.access}
                id={lib!.id}
                key={lib!.name}
                name={lib!.name}
                lang={lib!.language}
                topics={[]}
                lexicon={{ count }}
                isOwner={lib!.owner === userId}
                orgs={mems.map((mem) => ({
                    name: mem.organization.id,
                    label: mem.organization.name
                }))}
                orgId={lib!.org}
            ></Library>
        ))
        }
        <Options
            trigger={<Button className='mx-auto block' color='primary'>Create a new library</Button>}
            action={save.bind(null, randomID())}
            inputs={[{
                name: 'name',
                label: 'Library name',
            }, {
                name: 'collaborators',
                long: true,
                label: 'Collaborators (*=anyone)',
                isAdvanced: true,
            }, {
                name: 'viewers',
                long: true,
                label: 'Viewers (*=anyone)',
                isAdvanced: true
            }]}
            selects={[{
                name: 'access',
                label: 'Access',
                value: 'private',
                options: accessOptions
            }, {
                name: 'lang',
                label: 'Language',
                value: 'en',
                options: supportedLangs.map(lang => ({
                    name: lang,
                    label: langMap[lang]
                })),
            }]}></Options>
    </Main>
}
