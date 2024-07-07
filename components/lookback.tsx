import { getXataClient } from '@/lib/xata'
import { belongsToListedLibs } from '@/lib/auth'
import Commented from './markdown'
import moment from 'moment'
import { ReactNode } from 'react'
import { welcomeMap } from '@/lib/config'

export default async function Lookback() {
    const xata = getXataClient()
    moment().utcOffset('+08:00')
    const words = await xata
        .db
        .lexicon
        .filter({
            $all: [
                belongsToListedLibs(),
                {
                    $not: {
                        'word': { $any: Object.values(welcomeMap) }
                    }
                }
            ]
        })
        .sort('xata.createdAt', 'desc')
        .select(['lib.id', 'word'])
        .getMany({ pagination: { size: 10 } })
    return <LookbackWrapper>
        {words.length > 0 ? words.map(({ word, id, lib }) =>
            <span key={id} className='inline-block px-2 py-1'>
                <Commented key={word} md={word} lib={lib!.id} disableSave></Commented>
            </span>
        ) : <span className='inline-block px-2 py-1'>
            <Commented md={'无新增语汇。'}></Commented>
        </span>}
    </LookbackWrapper>
}

export const LookbackWrapper = ({ children }: { children: ReactNode }) => {
    return <div className='-mb-7 -mt-8'>
        <div className='w-full overflow-x-auto whitespace-nowrap border-b-2'>
            {children}
        </div>
        <label className='p-2 opacity-70 font-semibold'>近期回顾</label>
    </div>
}
