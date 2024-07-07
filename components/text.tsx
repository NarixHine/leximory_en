'use client'

import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { Spacer } from '@nextui-org/spacer'
import Options from './options'
import { langMap, colorMap } from '@/lib/config'
import { useRouter } from 'next/navigation'
import { stringToColor } from '@/lib/utils'
import { lora, cn } from '@/lib/fonts'

function Text({ id, title, lang, save, del, libId, isReadOnly, topics }: {
    id: string,
    title: string,
    lang: string,
    save: (form: FormData) => void,
    del?: () => Promise<void>
    libId: string
    isReadOnly: boolean
    topics: string[]
}) {
    const router = useRouter()
    return (<div className='w-full relative'>
        <Card fullWidth isPressable onPress={() => {
            router.push(`/library/${libId}/${id}`)
        }}>
            <CardBody className='p-7'>
                <a className='text-2xl text-balance' style={{
                    fontFamily: [lora.style.fontFamily, cn.style.fontFamily].join(',')
                }}>{title}</a>
                <Spacer y={6}></Spacer>
            </CardBody>
            <CardFooter className='p-7'>
                <div className='space-x-2 space-y-2 block'>
                    <Chip variant='flat' color={colorMap[langMap[lang]]}>{langMap[lang]}</Chip>
                    {topics.map(topic => <Chip key={topic} variant='flat' color={stringToColor(topic)}>{topic}</Chip>)}
                </div>
            </CardFooter>
        </Card>
        {!isReadOnly && <Options
            del={del}
            action={save}
            inputs={[{
                name: 'title',
                label: '标题',
                value: title
            }]}></Options>}
    </div>)
}

export default Text
