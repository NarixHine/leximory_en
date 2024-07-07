import { cn, lora } from '@/lib/fonts'

function H({ children, className, disableCenter, useLora, disableBlock }: {
    children: string,
    className?: string,
    disableCenter?: boolean,
    disableBlock?: boolean,
    useLora?: boolean
}) {
    return <h1
        style={{
            fontFamily: useLora ? `${lora.style.fontFamily}, ${cn.style.fontFamily}` : undefined
        }}
        className={`text-balance ${disableCenter ? '' : 'text-center'} ${disableBlock ? 'inline' : 'block'} ${className ?? 'text-5xl'}`}
    >{children}</h1>
}

export default H
