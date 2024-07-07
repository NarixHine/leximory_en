import Main from '@/components/main'
import H from '@/components/title'
import { Suspense } from 'react'
import Report from './report'
import Bell from './bell'
import { Spacer } from '@nextui-org/spacer'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import { Skeleton } from '@nextui-org/skeleton'
import { PrismaClient } from '@prisma/client'

export const metadata: Metadata = {
    title: '日报',
}

export default async function Daily() {
    const prisma = new PrismaClient()
    const hasSubscribed = Boolean(await prisma.subs.findFirst({
        where: {
            uid: auth().userId
        },
    }))

    return (
        <Main maxWidth={800}>
            <H>Daily review</H>
            <Spacer y={2}></Spacer>
            <Bell hasSubscribed={hasSubscribed}></Bell>
            <Suspense fallback={<Loading></Loading>}>
                <Report day='Today'></Report>
            </Suspense>
            <Suspense fallback={<Loading></Loading>}>
                <Report day='1 day ago'></Report>
            </Suspense>
            <Suspense fallback={<Loading></Loading>}>
                <Report day='4 days ago'></Report>
            </Suspense>
            <Suspense fallback={<Loading></Loading>}>
                <Report day='7 days ago'></Report>
            </Suspense>
        </Main>
    )
}

const Loading = () => (<div className='my-8'>
    <Skeleton disableAnimation className='animate-pulse rounded inline max-w-8'>
        <H disableCenter className='text-xl font-semibold opacity-80 -mb-2'>1 day ago</H>
    </Skeleton>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-5'>
        <div className='w-full h-32 bg-default-200 rounded-lg animate-pulse'></div>
        <div className='w-full h-32 bg-default-200 rounded-lg animate-pulse hidden sm:block'></div>
        <div className='w-full h-32 bg-default-200 rounded-lg animate-pulse hidden md:block'></div>
    </div>
</div>)
