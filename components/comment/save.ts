'use server'

import { authWrite } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import { revalidatePath } from 'next/cache'

async function saveComment(portions: string[], lib: string) {
    const xata = getXataClient()
    const [word, ...rest] = portions
    await authWrite(lib)
    rest[1] = rest[1].replaceAll('\n', '')
    await xata.db.lexicon.createOrUpdate({
        word: `{{${[rest[0]].concat(rest).join('||')}}}`,
        lib
    })
    revalidatePath(`/library/${lib}/corpus`)
    revalidatePath(`/library/`)
}

export default saveComment
