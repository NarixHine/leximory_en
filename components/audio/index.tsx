'use client'

import Commented, { CommentedProps } from '../markdown'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@nextui-org/button'
import { FaRegCirclePlay } from 'react-icons/fa6'
import { Card, CardBody } from '@nextui-org/card'
import { generateAudio, retrieveAudioUrl } from './gen'
import { toast } from 'sonner'

export default function AudioPlayer({ id, lib, md, ...props }: {
    id: string,
    lib: string
} & CommentedProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<'loading' | 'ungenerated' | 'generating' | 'ready' | 'lengthy'>('loading')
    const [url, setUrl] = useState<string | null>(null)

    function action() {
        const { current } = ref
        if (current) {
            if (status === 'ungenerated') {
                const { innerText } = current
                if (innerText.length > 5000) {
                    setStatus('lengthy')
                    return
                }
                setStatus('generating')
                generateAudio(id, lib, innerText).then(({ url, error }) => {
                    if (url) {
                        setUrl(url)
                        setStatus('ready')
                    }
                    else if (error) {
                        setStatus('ungenerated')
                        toast.error(error)
                    }
                })
            }
        }
    }

    useEffect(() => {
        retrieveAudioUrl(id).then((url) => {
            if (url) {
                setUrl(url)
                setStatus('ready')
            }
            else {
                setStatus('ungenerated')
            }
        })
    }, [id])

    return <Card className='-mx-10 px-5 mt-3 mb-6 bg-transparent' isBlurred>
        <CardBody>
            <div className='mt-2'>
                {url ? <audio
                    controls
                    className='w-full'
                    src={url}
                /> : <Button isLoading={status === 'loading' || status === 'generating'} isDisabled={status === 'lengthy'} variant='flat' radius='full' color='danger' startContent={<FaRegCirclePlay />} size='sm' onPress={() => action()}>
                    {
                        status === 'lengthy' ? '录音文本不多于 5000 字' :
                            status === 'loading' ? '加载中' :
                                status === 'ungenerated' ? '生成' :
                                    status === 'generating' ? '生成中' :
                                        status === 'ready' ? 'Ready!' : '未知'
                    }
                </Button>}
            </div>
            <div ref={ref} className='mt-5'>
                <Commented md={decodeURIComponent(md)} lib={lib} {...props}></Commented>
            </div>
        </CardBody>
    </Card>
}
