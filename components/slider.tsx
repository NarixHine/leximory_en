'use client'

import React from 'react'
import { use100vh } from 'react-div-100vh'
import { useSystemColorMode } from 'react-use-system-color-mode'

const Slider = ({ show, isVisible }: {
    show: boolean
    isVisible?: boolean
}) => {
    const vh = use100vh()
    const containerStyle: React.CSSProperties = {
        transition: 'transform 1s ease',
        transform: show ? 'translateY(0)' : 'translateY(100%)', // Slide in or out
        position: 'fixed',
        bottom: 0,
        left: 0,
        height: vh ?? '100vh',
        width: '100%',
        padding: '1rem',
        zIndex: 1000
    }
    const colorMode = useSystemColorMode()
    return isVisible ? (
        <div style={containerStyle} className={`${colorMode === 'dark' ? 'bg-black' : 'bg-white'} border-t-1 ${colorMode === 'dark' ? 'border-t-white' : 'border-t-black'}`}></div>
    ) : <></>
}

export default Slider
