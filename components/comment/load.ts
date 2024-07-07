'use server'

import { originals } from '@/lib/lang'
import { getXataClient } from '@/lib/xata'

export default async function load(word: string) {
    const xata = getXataClient()
    const words = originals(word)
    const recs = await xata.db.ecdict.filter({ word: { $any: words } }).select(['word', 'translation']).getMany()
    return recs
}
