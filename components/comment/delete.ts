'use server'

import { authWrite } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import { revalidatePath } from 'next/cache'

async function delComment(id: string, lib: string) {
    const xata = getXataClient()
    await authWrite(lib)
    await xata.db.lexicon.delete(id)
    revalidatePath(`/library/${lib}/corpus`)
    revalidatePath(`/library/`)
}

export default delComment
