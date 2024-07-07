'use client'

import { ReaderModeContext } from '@/lib/contexts'
import { Card, CardBody } from '@nextui-org/card'
import Star from './starBtn'
import Save from './corpus/save'
import { useContext } from 'react'
import { useUser } from '@clerk/nextjs'

export default function LibAside({ lib, lang, isOwner, isStarred, isReadOnly }: {
    lib: string
    lang: string
    isOwner: boolean
    isStarred: boolean
    isReadOnly: boolean
}) {
    const { isReaderMode } = useContext(ReaderModeContext)
    const { user } = useUser()
    return isReaderMode ? <></> : (
        <aside className='fixed bottom-2 right-2 flex flex-col space-y-2 pointer-events-none z-50'>
            <div className='flex flex-row-reverse'>
                {!isOwner && user && <Star lib={lib} userId={user.id} isStarred={isStarred}></Star>}
            </div>
            <Card shadow='none' isBlurred className='border-none bg-background/40 dark:bg-default-100/40 pointer-events-auto'>
                <CardBody className='px-3 pb-2 pt-0'>
                    <Save
                        lib={lib}
                        isReadOnly={isReadOnly}
                        compact
                        isEnglish={lang === 'en'}
                    />
                </CardBody>
            </Card>
        </aside>
    )
}
