import Main from '@/components/main'
import Digest from './digest'
import { TextsRecord, getXataClient } from '@/lib/xata'
import H from '@/components/title'
import { authRead } from '@/lib/auth'
import { SelectedPick } from '@xata.io/client'
import sanitizeHtml from 'sanitize-html'
import { notFound } from 'next/navigation'
import Nav from '@/components/nav'
import Topics from '@/components/topics'

export const maxDuration = 300

export async function generateMetadata({ params }: LibAndTextParams) {
    const xata = getXataClient()
    const rec = await xata.db.texts.select(['title']).filter({ id: params.text }).getFirst()
    return {
        title: rec?.title
    }
}

const getData = async (lib: string, text: string) => {
    const xata = getXataClient()
    const { isReadOnly } = await authRead(lib)
    const rec = await xata.db.texts.filter({ id: text }).select(['title', 'content', 'lib', 'lib.language', 'topics']).getFirst()
    if (!rec) {
        notFound()
    }
    return { rec, isReadOnly }
}

export default async function Page({ params }: LibAndTextParams) {
    const { rec, isReadOnly } = await getData(params.lib, params.text)
    const { title, content, lib, id, topics } = rec as SelectedPick<TextsRecord, ('lib' | 'content' | 'title' | 'topics')[]>
    return (<Main maxWidth={1200}>
        <Nav lib={{ id: lib!.id, name: lib!.name }} text={{ id: params.text, name: title }}></Nav>
        <H className={`sm:text-4xl mt-6 mb-2 text-3xl`} useLora>{title}</H>
        <Topics topics={topics}></Topics>
        <Digest isReadOnly={isReadOnly} id={id} content={sanitizeHtml(content).replaceAll('&gt;', '>')} lib={lib!.id} lang={lib!.language} topics={topics ?? []}></Digest>
    </Main>)
}
