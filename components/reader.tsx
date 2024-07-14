'use client'

import { ReaderModeContext } from '@/lib/contexts'
import { ReactNode, useState } from 'react'
import Slider from './slider'
import { useSystemColorMode } from 'react-use-system-color-mode'

export default function ReaderModeProvider({ children }: {
    children: ReactNode
}) {
    const [isReaderMode, setReaderMode] = useState(false)
    const [show, setShow] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const colorMode = useSystemColorMode()
    const readerMode = {
        isReaderMode,
        toggleReaderMode: () => {
            setShow(true)
            setTimeout(() => {
                if (isReaderMode) {
                    setReaderMode(false)
                    document.body.style.backgroundColor = ''
                }
                else {
                    setReaderMode(true)
                    document.body.style.backgroundColor = colorMode === 'dark' ? 'black' : 'white'
                }
                setShow(false)
                setTimeout(() => {
                    setIsVisible(false)
                }, 1000)
            }, 1000)
        }
    }
    return (
        <ReaderModeContext.Provider value={readerMode}>
            {children}
            <Slider show={show} isVisible={isVisible}></Slider>
        </ReaderModeContext.Provider>
    )
}