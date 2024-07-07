'use server'

import { getXataClient } from '@/lib/xata'
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
        await prisma.subs.deleteMany({
            where: {
                uid: auth().userId,
            }
        })
        revalidatePath(`/daily`)
    }
}
