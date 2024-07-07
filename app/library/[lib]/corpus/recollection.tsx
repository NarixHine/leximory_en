'use client'

import Commented from '@/components/markdown'
import { welcomeMap } from '@/lib/config'
import { LexiconRecord } from '@/lib/xata'
import { Button } from '@nextui-org/button'
import { RecordArray, SelectedPick } from '@xata.io/client'
import moment from 'moment'
import { useState } from 'react'
import { RiExpandLeftRightLine } from 'react-icons/ri'
import load from './action'

export default function Recollection({ words, lib, cursor, more, isReadOnly }: {
    words: RecordArray<SelectedPick<LexiconRecord, ('word' | 'lib.name')[]>>
    lib: string
    cursor: string
    more: boolean
    isReadOnly: boolean
}) {
    // @ts-ignore
    const [recol, setRecol] = useState<typeof words>([])
    const [newCursor, setNewCursor] = useState(cursor)
    const [moreWords, setMoreWords] = useState(more)
    return (<div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 grid-cols-2 gap-3 w-full'>
        {words.concat(recol).map(({ word, id, xata }, index, array) => {
            moment().utcOffset('+08:00')
            const anotherDay = array[index + 1] && !moment(xata.createdAt).isSame(array[index + 1].xata.createdAt, 'day')
            return <>
                <div className='w-full min-h-20 h-full flex flex-col justify-center items-center'>
                    <Commented key={word} md={word} lib={lib} deleteId={isReadOnly || Object.values(welcomeMap).includes(word) ? undefined : id} disableSave></Commented>
                </div>
                {anotherDay && <div className='w-full min-h-20 h-full p-2 border-1 flex flex-col justify-center items-center'>
                    <div className='text-center'>
                        {moment(array[index + 1].xata.createdAt).startOf('day').format('ll')}
                    </div>
                </div>}
            </>
        })}
        {moreWords && <div className='w-full min-h-20 h-full p-2 border-1 flex flex-col justify-center items-center'>
            <Button onClick={async () => {
                const { words, cursor, more } = await load(lib, newCursor)
                // @ts-ignore
                setRecol((prev) => prev.concat(words))
                setNewCursor(cursor)
                setMoreWords(more)
            }} radius='full' variant='light' size='lg' isIconOnly startContent={<RiExpandLeftRightLine></RiExpandLeftRightLine>}></Button>
        </div>}
    </div>)
}
