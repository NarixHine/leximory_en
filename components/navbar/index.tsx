'use client'

import { OrganizationSwitcher, UserButton, useAuth } from '@clerk/nextjs'
import {
	NavbarBrand,
	NavbarContent,
	Navbar as NextUINavbar,
} from '@nextui-org/navbar'
import { Button } from '@nextui-org/button'
import { AiOutlineLogin } from 'react-icons/ai'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './logo.png'
import { lora } from '@/lib/fonts'
import { useContext } from 'react'
import { ReaderModeContext } from '@/lib/contexts'
import { useRouter } from 'next/navigation'

function Navbar() {
	const { userId } = useAuth()
	const { isReaderMode, toggleReaderMode } = useContext(ReaderModeContext)

	const router = useRouter()

	return <NextUINavbar position='sticky' className={isReaderMode ? 'bg-transparent' : ''} isBordered>
		<NavbarBrand className='space-x-2'>
			{isReaderMode
				? <Link
					className={`bg-gradient-to-r text-xl ${lora.className}`}
					href={userId ? '/library' : '/'}
					onClick={() => {
						toggleReaderMode()
					}}
				>Leximory</Link>
				: <Image src={Logo} alt='Leximory' width={32} height={32} quality={100} onClick={() => {
					router.push(userId ? '/library' : '/')
				}}></Image>}
		</NavbarBrand>
		{!isReaderMode && <NavbarContent justify='end'>
			{
				userId ?
					<>
						<UserButton userProfileUrl='/user'></UserButton>
						<OrganizationSwitcher createOrganizationUrl='/create' organizationProfileUrl='/org'></OrganizationSwitcher>
					</> :
					<Button as={Link} isIconOnly variant='flat' color='danger' href='/sign-in'><AiOutlineLogin></AiOutlineLogin></Button>
			}
		</NavbarContent>}
	</NextUINavbar>
}

export default Navbar
