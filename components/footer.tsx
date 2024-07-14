'use client'

import { useContext } from 'react'
import { ReaderModeContext } from '@/lib/contexts'
import External from './external'

const Footer = () => {
    const { isReaderMode } = useContext(ReaderModeContext)
    return (
        <footer className='text-center opacity-70 mb-5 mt-10'>
            {isReaderMode
                ? <p>Generated on <span className='font-mono'>Leximory.com</span></p>
                : <p>This is the English mirror site of <span className='font-mono'>leximory.com</span>.<br></br>DEMONSTRATION PURPOSES ONLY</p>}
        </footer>
    )
}

export default Footer
