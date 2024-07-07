import { belongsToAnyUserLibs } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import moment from 'moment-timezone'
import Commented from '@/components/markdown'
import H from '@/components/title'

export default async function Report({ day }: {
    day: '一天前' | '四天前' | '七天前'
}) {
    const range = {
        '一天前': [1, 0],
        '四天前': [4, 3],
        '七天前': [7, 6],
    }
    const xata = getXataClient()
    const words = await xata.db.lexicon.select(['id', 'word']).filter({
        $all: [
            belongsToAnyUserLibs(),
            {
                'xata.createdAt': { $ge: moment().tz('Asia/Shanghai').startOf('day').subtract(range[day][0], 'day').utc().toDate() }
            },
            {
                'xata.createdAt': { $lt: moment().tz('Asia/Shanghai').startOf('day').subtract(range[day][1], 'day').utc().toDate() }
            },
            {
                'word': { $contains: '||' }
            }
        ]
    }).getMany({
        pagination: {
            size: 50,
        }
    })

    return words.length > 0 ? (
        <div className='my-8'>
            <H disableCenter className='text-xl font-semibold opacity-80 -mb-2'>{day}</H>
            <div suppressHydrationWarning className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                {words.map((word) => (
                    <Commented key={word.id} md={word.word} lexicon='none' asCard></Commented>
                ))}
            </div>
        </div>
    ) : <></>
}