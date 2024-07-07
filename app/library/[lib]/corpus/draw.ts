'use server'

import { getXataClient } from '@/lib/xata'

export default async function draw(lib: string, start: Date, end: Date) {
    const xata = getXataClient()
    const records = await xata.db.lexicon.sort('*', 'random').select(['word']).filter({
        $all: [
            {
                'xata.createdAt': { $ge: start }
            },
            {
                'xata.createdAt': { $lt: end }
            },
            {
                lib: { $is: lib }
            }
        ]
    }).getMany({ pagination: { size: 5 } })
    return records
}
