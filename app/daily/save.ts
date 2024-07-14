'use server'

import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export default async function saveSubs(subs: PushSubscription) {
    const { userId } = auth()
    if (userId) {
        await prisma.subs.create({
            data: {
                uid: auth().userId,
                subscription: JSON.stringify(subs)
            }
        })
        revalidatePath(`/daily`)
    }
}

export async function delSubs() {
    const { userId } = auth()
    if (userId) {
        const { xata_id } = await prisma.subs.findFirstOrThrow({
            where: {
                uid: auth().userId,
            }
        })
        await prisma.subs.delete({
            where: {
                xata_id
            }
        })
        revalidatePath(`/daily`)
    }
}
