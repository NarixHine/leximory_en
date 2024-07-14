'use client'

import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'
import { NavProps } from '.'
import { FaRegCircleUser } from 'react-icons/fa6'
import { IoLibraryOutline } from 'react-icons/io5'
import { AiOutlineFileText } from 'react-icons/ai'
import { Button } from '@nextui-org/button'
import { TbNotebook } from 'react-icons/tb'
import Link from 'next/link'
import { useContext } from 'react'
import { ReaderModeContext } from '@/lib/contexts'
import { useRouter } from 'next/navigation'

export default function NavBreadcrumbs({ lib, text, tenant }: NavProps & { tenant: string }) {
    const { isReaderMode } = useContext(ReaderModeContext)
    const router = useRouter()
    return isReaderMode ? <></> : (
        <div className='sticky flex justify-center top-[74px] -mt-8 z-50 left-0 w-full space-x-1'>
            <Breadcrumbs variant='solid' radius='lg' color='primary' className='overflow-x-hidden max-w-[90%]'>
                <BreadcrumbItem className='max-w-full' startContent={<FaRegCircleUser></FaRegCircleUser>} onPress={() => {
                    router.push(`/library`)
                }}>{tenant}</BreadcrumbItem>
                {lib && <BreadcrumbItem className='max-w-full' startContent={<IoLibraryOutline></IoLibraryOutline>} onPress={() => {
                    router.push(`/library/${lib.id}`)
                }}>{lib.name}</BreadcrumbItem>}
                {text && lib && <BreadcrumbItem className='max-w-full' startContent={<AiOutlineFileText></AiOutlineFileText>} onPress={() => {
                    router.push(`/library/${lib.id}/${text.id}`)
                }}>{text.name}</BreadcrumbItem>}
            </Breadcrumbs>
            {lib && <Button className='bg-primary-200' size='sm' href={`/library/${lib.id}/corpus`} as={Link} radius='lg' isIconOnly startContent={<TbNotebook></TbNotebook>}></Button>}
        </div>
    )
}
