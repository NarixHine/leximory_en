import H from '@/components/title'
import { Spacer } from '@nextui-org/spacer'
import Main from '@/components/main'
import Recollection from './recollection'
import load from './action'
import Test from './test'
import { Divider } from '@nextui-org/divider'
import Save from './save'
import Nav from '@/components/nav'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '语料库'
}

export default async function Page({ params }: LibParams) {
    const { lib } = params
    const { words, cursor, more, isReadOnly } = await load(lib)
    return (<Main maxWidth={1000}>
        <Nav lib={{ id: lib, name: words[0].lib!.name }}></Nav>
        <Spacer y={7}></Spacer>
        <H>{words[0].lib!.name}</H>
        <Spacer y={5}></Spacer>
        <div className='flex flex-col space-y-6 sm:flex-row sm:space-x-5'>
            <div className='basis-1/3 sm:border-r-1 sm:pr-2'>
                <Save lib={lib} isReadOnly={isReadOnly} isEnglish={words[0].lib!.language === 'en'}></Save>
                <Divider className='my-4'></Divider>
                <Test lib={lib} latestTime={words[0].xata.createdAt.toISOString().split('T')[0]}></Test>
            </div>
            <div className='basis-3/5'>
                <Recollection isReadOnly={isReadOnly} words={words} lib={lib} cursor={cursor} more={more}></Recollection>
            </div>
        </div>
    </Main>)
}
