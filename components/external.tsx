import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from '@nextui-org/button'
import { RiExternalLinkLine } from 'react-icons/ri'
import Link from 'next/link'

export default function External({ children, link, ...props }: {
    children: ReactNode
    link: string
} & ComponentPropsWithoutRef<typeof Button>) {
    return <Button target='_blank' as={Link} variant='light' size='sm' startContent={<RiExternalLinkLine></RiExternalLinkLine>} href={link} {...props}>
        {children}
    </Button>
}
