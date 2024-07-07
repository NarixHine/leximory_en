'use client'

import { Button } from '@nextui-org/button'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { Divider } from '@nextui-org/divider'
import { Spacer } from '@nextui-org/spacer'
import { FaBookBookmark } from 'react-icons/fa6'
import Options from './options'
import { langMap, colorMap, supportedLangs, libAccessStatusMap, accessOptions } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { lora, cn } from '@/lib/fonts'

function Library({ id, name, topics, lexicon, lang, save, del, isOwner, access, orgId, orgs }: {
    id: string,
    name: string,
    topics: string[],
    access: number,
    lexicon: {
        count: number,
    },
    lang: string,
    save: (form: FormData) => void,
    del?: () => Promise<void>,
    isOwner: boolean,
    orgId: string | null | undefined,
    orgs: { label: string, name: string }[]
}) {
    const router = useRouter()
    return (<div className='w-full relative'>
        <Card fullWidth isPressable onPress={() => {
            router.push(`/library/${id}`)
        }}>
            <CardBody className='p-6'>
                <a className='text-4xl' style={{
                    fontFamily: [lora.style.fontFamily, cn.style.fontFamily].join(',')
                }}>{name}</a>
                <Spacer y={5}></Spacer>
                <div className='flex space-x-2'>
                    {[langMap[lang]].concat(topics as any).map(tag => <Chip key={tag} variant='flat' color={colorMap[tag]}>{tag}</Chip>)}
                </div>
            </CardBody>
            <Divider></Divider>
            <CardFooter className='p-4 flex gap-4'>
                <Button onClick={(e) => { e.stopPropagation() }} as={Link} href={`/library/${id}/corpus`} startContent={<FaBookBookmark></FaBookBookmark>} color='primary' variant='flat'>语料本</Button>
                <div className='flex flex-col'>
                    <p className='text-xs opacity-80'>积累的词汇</p>
                    <p className='text-lg'>{lexicon.count}</p>
                </div>
            </CardFooter>
        </Card>
        {isOwner && <Options
            del={del}
            action={save}
            shareUrl={access !== libAccessStatusMap.private ? `/library/${id}` : undefined}
            inputs={[{
                name: 'name',
                label: '文库名',
                value: name
            }]}
            selects={[{
                name: 'access',
                label: '权限',
                value: Object.keys(libAccessStatusMap).find(key => libAccessStatusMap[key] === access),
                options: accessOptions
            }, {
                name: 'lang',
                label: '语言',
                value: lang,
                options: supportedLangs.map(lang => ({
                    name: lang,
                    label: langMap[lang]
                })),
                disabled: true
            }, {
                name: 'org',
                label: '文库所属小组',
                value: typeof orgId !== 'string' ? 'none' : orgId,
                options: orgs.concat({
                    label: '无',
                    name: 'none'
                }),
                isAdvanced: true
            }]}></Options>}
    </div>)
}

export default Library
