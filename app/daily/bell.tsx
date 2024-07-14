'use client'

import { Button } from '@nextui-org/button'
import { FcAlarmClock } from "react-icons/fc"
import saveSubs, { delSubs } from './save'

export default function Bell({ hasSubscribed }: {
    hasSubscribed: boolean
}) {
    const subscribe = async () => {
        const register = await navigator.serviceWorker.register('/sw.js')

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })

        await saveSubs(subscription)
    }
    return (
        <div className='flex flex-col justify-center items-center space-y-1'>
            <Button variant={hasSubscribed ? 'solid' : 'ghost'} onPress={hasSubscribed ? () => delSubs() : () => subscribe()} size='lg' radius='full' color='primary' startContent={<FcAlarmClock />}>{`${hasSubscribed ? 'Turn off' : 'Turn on'} review notification (22:00)`}</Button>
            <div className='opacity-50 text-sm text-balance text-center'>
                iOS users need to add Leximory to the home screen
            </div>
        </div>
    )
}
