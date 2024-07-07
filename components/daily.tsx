'use client'

import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import { IoNewspaperOutline } from 'react-icons/io5'

export default function DailyCard() {
    const router = useRouter()
    return <div className={`py-2 px-4 items-center flex bg-gradient-to-r from-primary-200 to-warning-200 dark:from-primary-400 dark:to-warning-400 rounded-lg`}>
        <div className='font-semibold opacity-50'>Leximory 日报</div>
        <div className='flex-1'></div>
        <div>
            <Button
                onClick={() => router.push('/daily')}
                variant={'light'}
                className='font-semibold'
                color={'primary'}
                startContent={<IoNewspaperOutline></IoNewspaperOutline>}
            >查看</Button>
        </div>
    </div>
}
