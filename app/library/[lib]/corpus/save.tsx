'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { save } from './action'
import { useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import Comment from '@/components/comment'

export default function Save({ lib, isReadOnly, compact, isEnglish }: { lib: string, isReadOnly: boolean, compact?: boolean, isEnglish?: boolean }) {
    const [input, setInput] = useState('')
    const [pending, setPending] = useState(false)
    return <div className='my-2'>
        {!compact && <h2 className='text-xl'>保存外部生词</h2>}
        <div className='flex space-x-2'>
            <Input name={'word'} value={input} onChange={(e) => setInput(e.target.value)} variant='underlined' size='sm' label={compact ? '手动输入词汇' : '输入词汇'} className='flex-1'></Input>
            <div className='flex flex-col-reverse'>
                <div className='flex space-x-2'>
                    {isEnglish && <Comment
                        lib={lib}
                        params={`[\"${input}\"]`}
                        disableSave={isReadOnly ? 'true' : undefined}
                        trigger={{
                            size: 'sm',
                            isIconOnly: true,
                            variant: 'flat',
                            startContent: <IoMdSearch></IoMdSearch>,
                            color: 'primary'
                        }}
                    ></Comment>}
                    {!isReadOnly && <Button onPress={async () => {
                        setPending(true)
                        await save(lib, input)
                        setInput('')
                        setPending(false)
                    }} isLoading={pending} size='sm' type='submit' variant='flat' color='primary'>保存</Button>}
                </div>
            </div>
        </div>
    </div>
}
