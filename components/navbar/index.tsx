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
import { lora, xw } from '@/lib/fonts'
import { TbMessage } from 'react-icons/tb'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useEffect, useState } from 'react'
import loadApplications, { countUnreadApplications, approveApplication, rejectApplication } from './actions'
import { ApplicationsRecord } from '@/lib/xata'
import { SelectedPick, PageRecordArray } from '@xata.io/client'
import { Badge } from '@nextui-org/badge'
import { Divider } from '@nextui-org/divider'
import { ApplicationStatus, applicationAccessMap } from '@/lib/config'
import { MdExpandMore } from 'react-icons/md'
import moment from 'moment'
import { FaCheck } from 'react-icons/fa6'
import { GoSmiley } from 'react-icons/go'
import { useContext } from 'react'
import { ReaderModeContext } from '@/lib/contexts'
import { useRouter } from 'next/navigation'

function Navbar() {
	const { userId } = useAuth()
	const [applications, setApplications] = useState<PageRecordArray<SelectedPick<ApplicationsRecord, ('access' | 'lib.name' | 'applicant' | 'note' | 'status')[]>>>()
	const [cursor, setCursor] = useState<string>()
	const [more, setMore] = useState(true)
	const [isOpen, setIsOpen] = useState(false)
	const [unread, setUnread] = useState(0)
	const [statuses, setStatuses] = useState<number[]>([])
	moment().utcOffset('+08:00')

	const { isReaderMode, toggleReaderMode } = useContext(ReaderModeContext)

	const loadMore = async (isInit?: boolean) => {
		const { applications: newApplications, cursor: newCursor, more: newMore } = await loadApplications(cursor)
		// @ts-ignore
		setApplications(applications => {
			// @ts-ignore
			const joined = [...(isInit ? [] : applications), ...newApplications]
			// @ts-ignore
			setStatuses(joined.map(({ status }) => status))
			return joined
		})
		setCursor(newCursor)
		setMore(newMore)
		setUnread(await countUnreadApplications())
	}
	useEffect(() => {
		loadMore(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
						<Popover placement='bottom-end' isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
							<PopoverTrigger>
								<Badge
									content={unread}
									isInvisible={!(unread > 0)}
									size='sm'
									color='primary'
								>
									<Button
										startContent={
											<TbMessage></TbMessage>
										}
										onPress={() => {
											if (applications)
												setIsOpen(!isOpen)
										}}
										isIconOnly
										variant='flat'
										color='primary'
										size='sm'
										radius='full'
									></Button>
								</Badge>
							</PopoverTrigger>
							<PopoverContent>
								{
									applications && applications.length > 0
										? <div className='w-[360px]'>
											{
												applications.map(({ note, access, lib, applicant, id, xata }, index) =>
													<div key={id}>
														<Divider hidden={index === 0}></Divider>
														<div className={`flex space-x-2 p-6 ${index === applications.length - 1 ? 'pb-2' : ''}`}>
															<div className='flex-1'>
																<p className='font-mono'>{moment(xata.updatedAt).startOf('day').format('ll')}</p>
																<div className='my-2'>
																	用户<span className='font-mono mx-1 break-all'>{applicant}</span>
																	正在请求文库
																	<span className='underline underline-offset-4 mx-1'>{lib!.name}</span>
																	的
																	<span className='underline underline-offset-4 mx-1'>{applicationAccessMap[access]}</span>
																	权限。
																</div>
																{note && <div>
																	<br />
																	备注：
																	<div className='heti'>
																		<blockquote>
																			{note}
																		</blockquote>
																	</div>
																</div>}
															</div>
															<div className='flex flex-col justify-center space-y-2 border-l-small pl-4'>
																{statuses[index] !== ApplicationStatus.Rejected && <Button
																	onPress={() => {
																		approveApplication(id, lib!.id, access, applicant)
																		setStatuses((prev) => [...prev.slice(0, index), ApplicationStatus.Approved, ...prev.slice(index + 1)])
																		setUnread((prev) => prev - 1)
																	}}
																	color='primary'
																	variant='flat'
																	size='sm'
																	isDisabled={statuses[index] === ApplicationStatus.Approved}
																	startContent={statuses[index] === ApplicationStatus.Approved && <FaCheck></FaCheck>}
																>批准</Button>}
																{statuses[index] !== ApplicationStatus.Approved && <Button
																	onPress={() => {
																		rejectApplication(id)
																		setStatuses((prev) => [...prev.slice(0, index), ApplicationStatus.Rejected, ...prev.slice(index + 1)])
																		setUnread((prev) => prev - 1)
																	}}
																	color='danger'
																	variant='flat'
																	size='sm'
																	isDisabled={statuses[index] === ApplicationStatus.Rejected}
																	startContent={statuses[index] === ApplicationStatus.Rejected && <FaCheck></FaCheck>}
																>拒绝</Button>}
															</div>
														</div>
													</div>
												)
											}
											<div className='w-full flex justify-center mb-4'>
												{more && <Button
													onPress={() => {
														loadMore()
													}}
													startContent={<MdExpandMore />}
													variant='ghost'
													isIconOnly
													color='secondary'
													radius='full'
												></Button>}
											</div>
										</div>
										: <div className='flex justify-center items-center p-10'>
											<div className={`text-2xl ${xw.className}`}>暂无申请 <GoSmiley className='inline'></GoSmiley></div>
										</div>
								}
							</PopoverContent>
						</Popover>
						<UserButton userProfileUrl='/user'></UserButton>
						<OrganizationSwitcher createOrganizationUrl='/create' organizationProfileUrl='/org'></OrganizationSwitcher>
					</> :
					<Button as={Link} isIconOnly variant='flat' color='danger' href='/sign-in'><AiOutlineLogin></AiOutlineLogin></Button>
			}
		</NavbarContent>}
	</NextUINavbar>
}

export default Navbar
