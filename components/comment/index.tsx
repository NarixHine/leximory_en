'use client'

import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Skeleton } from '@nextui-org/skeleton'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover'
import Markdown from 'markdown-to-jsx'
import { FaBookBookmark, FaCheck } from 'react-icons/fa6'
import saveComment from './save'
import { ComponentProps, useContext, useEffect, useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import delComment from './delete'
import load from './load'
import { ReaderModeContext } from '@/lib/contexts'
import { randomID } from '@/lib/utils'
import { Card, CardBody } from '@nextui-org/card'

function Comment({ params, lib, disableSave, deleteId, trigger, asCard }: {
    params: string,
    lib: string,
    disableSave?: string
    deleteId?: string
    trigger?: ComponentProps<typeof Button>
    asCard?: string
}) {
    const parsedParams = JSON.parse(params.replaceAll('{', '').replaceAll('}', '').replaceAll('\n', '\\n')).map((param: string) => param.replaceAll('\\n', '\n'))

    const [words, setWords] = useState([parsedParams])
    const isOnDemand = parsedParams.length === 1
    const [isLoaded, setIsLoaded] = useState(!isOnDemand)
    const [status, setStatus] = useState('')
    useEffect(() => {
        setWords([parsedParams])
        setIsLoaded(!isOnDemand)
        setStatus('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, isOnDemand])

    const init = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (isOnDemand && !isLoaded) {
            const defs = await load(words[0][0])
            if (defs.length === 0) {
                setWords(words => [[words[0][0], words[0][0], '未找到Definition。']])
            }
            else {
                setWords(words => defs.map((word) => [
                    words[0][0],
                    word.word,
                    word.translation?.replaceAll('\\n', '\n\n')
                ]))
            }
            setIsLoaded(true)
        }
    }

    const uid = randomID()

    const [isVisible, setIsVisible] = useState(false)

    const { isReaderMode } = useContext(ReaderModeContext)
    return eval(asCard ?? 'false')
        ? <Card shadow='sm' fullWidth radius='sm'>
            <CardBody className='p-4 leading-snug'>
                <div className={'font-bold text-lg'}>{words[0][1]}</div>
                <div className={`relative ${isVisible ? '' : 'flex justify-center items-center'}`}>
                    {!isVisible && <Button
                        variant='light'
                        size='sm'
                        color='secondary'
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => setIsVisible(!isVisible)}
                    >Reveal</Button>}
                    <div className={isVisible ? undefined : 'invisible'}>
                        {
                            words[0][2] && <div>
                                {<div className='font-bold mb-1 mt-2'>Definition</div>}
                                <Markdown>{words[0][2]}</Markdown>
                            </div>
                        }
                        {
                            words[0][3] && <div>
                                {<div className='font-bold mb-1 mt-2'>Etymology</div>}
                                <Markdown>{words[0][3]}</Markdown>
                            </div>
                        }
                        {
                            words[0][4] && <div>
                                <div className='font-bold mb-1 mt-2'>Cognates</div>
                                <Markdown>{words[0][4]}</Markdown>
                            </div>
                        }
                    </div>
                </div>
            </CardBody>
        </Card> : <><Popover placement='right'>
            <PopoverTrigger>
                {trigger ? <Button {...trigger} onClick={init}></Button> : <button className={status === 'deleted' ? 'line-through' : `${isReaderMode ? '' : 'underline decoration-wavy'} ${isOnDemand ? 'decoration-primary/60' : 'decoration-danger'}`} onClick={init}>
                    {words[0][0]}
                    {isReaderMode && words[0][2] && <>
                        <label htmlFor={uid} className='margin-toggle sidenote-number'></label>
                        <input type='checkbox' id={uid} className='margin-toggle' />
                    </>}
                </button>}
            </PopoverTrigger>
            <PopoverContent className='max-w-80'>
                <div className='p-3 space-y-5'>
                    {
                        isLoaded
                            ? words.map((portions) => <div key={portions[1]}>
                                <Note portions={portions}></Note>
                                {!eval(disableSave ?? 'false') && <>
                                    <Divider className='my-2'></Divider>
                                    <Button
                                        size='sm'
                                        isDisabled={status === 'saved'}
                                        isLoading={status === 'loading'}
                                        startContent={status === 'saved'
                                            ? <FaCheck></FaCheck>
                                            : (status !== 'loading' && <FaBookBookmark></FaBookBookmark>)}
                                        color='primary'
                                        variant='flat'
                                        onClick={async () => {
                                            setStatus('loading')
                                            saveComment(portions, lib)
                                                .then(() => {
                                                    setStatus('saved')
                                                })
                                                .catch(() => {
                                                    setStatus('')
                                                })
                                        }}
                                    >Save to Notebook</Button>
                                </>}
                                {deleteId && deleteId !== 'undefined' && <>
                                    <Divider className='my-2'></Divider>
                                    <Button
                                        isDisabled={status === 'deleted'}
                                        size='sm'
                                        startContent={<RiDeleteBin6Line />}
                                        color='danger'
                                        variant='flat'
                                        onClick={async () => {
                                            await delComment(deleteId, lib)
                                            setStatus('deleted')
                                        }}
                                    >从语料本删除</Button>
                                </>}
                            </div>)
                            : <div className='space-y-3 w-40'>
                                <Skeleton className='w-3/5 rounded-lg'>
                                    <div className='h-3 w-3/5 rounded-lg bg-default-200 mb-2'></div>
                                </Skeleton>
                                <Skeleton className='w-2/5 rounded-lg'>
                                    <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
                                </Skeleton>
                                <Skeleton className='w-full rounded-lg'>
                                    <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
                                </Skeleton>
                                <Skeleton className='w-full rounded-lg'>
                                    <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
                                </Skeleton>
                            </div>
                    }
                </div>
            </PopoverContent>
        </Popover>
            {
                isReaderMode && words[0][2] && <span className='sidenote text-sm'>
                    <Note portions={words[0]} isCompact></Note>
                </span>
            }
        </>
}

function Note({ portions, isCompact }: {
    portions: string[]
    isCompact?: boolean
}) {
    const margin = isCompact ? 'mt-1' : 'my-2'
    return (<div className={isCompact ? 'leading-tight' : ''}>
        <div className={isCompact ? 'font-bold text-[1rem]' : 'font-extrabold text-large'}>{portions[1]}</div>
        {
            portions[2] && <div className={margin}>
                {!isCompact && <div className='font-bold'>Definition</div>}
                <Markdown>{isCompact ? portions[2].replaceAll('\n\n', '; ') : portions[2]}</Markdown>
            </div>
        }
        {
            portions[3] && <div className={margin}>
                {!isCompact && <div className='font-bold'>Etymology</div>}
                <Markdown>{portions[3]}</Markdown>
            </div>
        }
        {
            portions[4] && <div className={margin}>
                {!isCompact && <div className='font-bold'>Cognates</div>}
                <Markdown>{portions[4]}</Markdown>
            </div>
        }
    </div>)
}

export default Comment
