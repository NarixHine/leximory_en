'use server'

import { authWrite } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import { revalidatePath } from 'next/cache'

export default async function save(id: string, content: string, topics: string[], lib: string) {
    const xata = getXataClient()
    await authWrite(lib)
    await xata.db.texts.update(id, {
        content,
        topics
    })
    revalidatePath(`/library/${lib}/${id}`)
}
