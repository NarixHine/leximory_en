'use client'

import { ReaderModeContext } from '@/lib/contexts'
import Image from 'next/image'
import { useContext } from 'react'

export default function MdImg({ src, alt, title }: {
    src: string,
    alt: string,
    title: string
}) {
    const { isReaderMode } = useContext(ReaderModeContext)
    return isReaderMode ? <></> : (
        <span className='w-full relative aspect-video block'>
            <Image
                quality={90}
                title={title}
                alt={alt}
                src={src}
                fill
                sizes='(min-width: 600px) 600px, 50vw'
                style={{
                    objectFit: 'contain',
                }}
            />
        </span>
    )
}