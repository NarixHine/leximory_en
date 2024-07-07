'use client'

import Commented from '@/components/markdown'
import { welcomeMap } from '@/lib/config'
import { LexiconRecord } from '@/lib/xata'
import { getLocalTimeZone, parseAbsolute, parseDate } from '@internationalized/date'
import { Button } from '@nextui-org/button'
import { DateRangePicker } from '@nextui-org/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { SelectedPick, PageRecordArray } from '@xata.io/client'
import { useState } from 'react'
import draw from './draw'
import moment from 'moment'

export default function Test({ lib, latestTime, compact, disableDel }: {
    lib: string
    latestTime: string
    compact?: boolean
    disableDel?: boolean
}) {
    // @ts-ignore
    const [words, setWords] = useState<PageRecordArray<SelectedPick<LexiconRecord, 'word'[]>>>([])
    const [start, setStart] = useState(parseDate(latestTime).subtract({ days: 6 }))
    const [end, setEnd] = useState(parseDate(latestTime))
    return <div>
        {!compact && <h2 className='text-xl'>自我检测</h2>}
        <I18nProvider locale='zh-CN'>
            <DateRangePicker
                className='my-2'
                label='词汇选取范围'
                granularity='day'
                value={{ start, end }}
                onChange={({ start, end }) => {
                    setStart(start)
                    setEnd(end)
                }}
                variant='underlined'
                color='primary'
                isReadOnly={compact}
            ></DateRangePicker>
        </I18nProvider>
        <div className='flex space-x-2'>
            <div className='flex flex-col items-center justify-center flex-1 border-x-1 text-nowrap space-x-2 min-h-32 p-1'>
                {
                    words.map(({ word, id }) => (
                        !Object.values(welcomeMap).includes(word) && <Commented key={word} md={word} lib={lib} deleteId={disableDel ? undefined : id} disableSave></Commented>
                    ))
                }
            </div>
            <Button size='sm' variant='flat' color='primary' onClick={async () => {
                const words = await draw(lib, moment(start.toDate(getLocalTimeZone())).startOf('day').toDate(), moment(end.toDate(getLocalTimeZone())).add(1, 'day').startOf('day').toDate())
                setWords(words)
            }}>{compact ? '抽取' : '抽取 5 个'}</Button>
        </div>
    </div>
}
