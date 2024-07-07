'use client'

import { use100vh } from 'react-div-100vh'

export default function Main({ children, className, maxWidth }: {
    children: React.ReactNode,
    className?: string,
    maxWidth?: number
}) {
    const height = use100vh()
    return (
        <main
            style={{
                maxWidth: maxWidth ?? 650,
                minHeight: height ? height - 190 : 'calc(100vh - 190px)',
            }}
            className={`w-4/5 p-3 pt-9 mx-auto ${className}`}>
            {children}
        </main>
    )
}
