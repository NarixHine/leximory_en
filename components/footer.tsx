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
                : <p>Get in touch: <span className='font-mono'>hi@leximory.com</span></p>}
            {!isReaderMode && <p>
                <External link='/intro'>
                    从记忆到心会
                </External>
                <External link='/guide/reading-while-listening'>
                    边听边读
                </External>
                <External link='https://space.bilibili.com/3494376432994441/'>
                    哔哩哔哩
                </External>
                <External link='https://afdian.net/a/leximory'>
                    爱发电捐助
                </External>
            </p>}
        </footer>
    )
}

export default Footer
