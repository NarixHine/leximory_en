'use server'

import { authRead, authWrite } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import { revalidatePath } from 'next/cache'

export default async function load(lib: string, cursor?: string) {
    const xata = getXataClient()
    const { isReadOnly } = await authRead(lib)
    const res = await xata.db.lexicon.filter({ lib }).sort('xata.createdAt', 'desc').select(['lib.name', 'word', 'lib.language']).getPaginated({
        pagination: { size: 21, after: cursor },
    })
    return { words: res.records, cursor: res.meta.page.cursor, more: res.meta.page.more, isReadOnly }
}

export const save = async (lib: string, word: string) => {
    'use server'
    const xata = getXataClient()
    await authWrite(lib)
    await xata.db.lexicon.create({
        lib,
        word: `{{${word}}}`
    })
    revalidatePath(`/library/${lib}/corpus`)
}
