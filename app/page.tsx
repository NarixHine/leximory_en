import Main from '@/components/main'
import { auth } from '@clerk/nextjs/server'
import H from '@/components/title'
import { playfair, xw } from '@/lib/fonts'
import { Button } from '@nextui-org/button'
import { Spacer } from '@nextui-org/spacer'
import Link from 'next/link'
import Faq from './faq'
import { redirect } from 'next/navigation'
import Fade from '@/components/fade'
import Markdown from '@/components/markdown'
import { PiShootingStarThin } from 'react-icons/pi'
import { Card, CardBody } from '@nextui-org/card'
import { ReactNode } from 'react'
import { Input } from '@nextui-org/input'
import { MdOutlineGroupAdd } from 'react-icons/md'
import Test from './library/[lib]/corpus/test'
import { RadioGroup, Radio } from '@nextui-org/radio'
import External from '@/components/external'

export default function Home() {
	const { userId } = auth()
	if (userId) {
		redirect('/library')
	}
	return <Main maxWidth={1000} className={'w-11/12'}>
		<H className={`${playfair.className} text-danger text-6xl sm:text-8xl lg:text-9xl`}>
			Leximory
		</H>

		<Spacer y={5}></Spacer>

		<div className='flex justify-center items-center space-x-2'>
			<div>
				<H className={`text-2xl sm:text-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000`}>
					Get Language Learning Right
				</H>
				<H className={`text-lg sm:text-xl animate-in fade-in slide-in-from-bottom-10 duration-1000`}>
					Intersive Reading · Easy Review
				</H>
			</div>
			<div className='flex justify-center items-center'>
				<Button startContent={<PiShootingStarThin />} color='danger' href='/library' as={Link} variant='flat' size='lg' className='animate-bounce font-semibold'>Get Started</Button>
			</div>
		</div>

		<Spacer y={10}></Spacer>

		<H className={`${xw.className} text-6xl mb-4`}>
			Features
		</H>
		<div className='flex flex-col space-y-3 w-full'>
			<div className='flex flex-col sm:flex-row space-x-0 sm:space-x-3 space-y-3 sm:space-y-0'>
				<div className='basis-2/5'>
					<BentoCard title='One-click import'>
						<div className='flex w-full'>
							<Input
								className='flex-1'
								label='Link'
								placeholder='https://www.wikimedia.com/...'
								variant='underlined'
								color='danger'
							/>
							<div className='flex flex-col-reverse'>
								<Button variant='light' color='danger'>Read</Button>
							</div>
						</div>
					</BentoCard>
				</div>
				<div className='basis-3/5'>
					<BentoCard title='Test syllabus vocab'>
						<RadioGroup
							label='Test syllabus'
							defaultValue={'gaozhong'}
							orientation='horizontal'
						>
							<Radio value='none'>none</Radio>
							<Radio value='chuzhong'>middle school</Radio>
							<Radio value='gaozhong'>high school</Radio>
							<Radio value='cet6'>CET 6</Radio>
						</RadioGroup>
					</BentoCard>
				</div>
			</div>

			<div className='flex space-x-0 sm:space-x-3 space-y-3 sm:space-y-0 flex-col sm:flex-row'>
				<div className='flex basis-2/3'>
					<BentoCard title='AI annotation'>
						<div className='px-16'>
							<Markdown className={'max-h-64'} disableSave md={'Yes, the newspapers were right: snow was general all over Ireland. It was falling on every part of the dark central plain, on the {{treeless||treeless||***adj.*** (没有树木的) (of a place) having no trees||***tree*** (tree) + ***-less*** (without)}} hills, falling softly upon the Bog of Allen and, farther westward, softly falling into the dark {{mutinous||mutinous||***adj.*** (叛变的) (of a group of people) refusing to obey orders or showing a wish to rebel; rebellious||***mutin*** (rebellion) + ***-ous***||***mutin*** (mutiny) →  **mutin**y (叛乱)}} Shannon waves. It was falling, too, upon every part of the lonely churchyard on the hill where Michael Furey lay buried. It lay thickly drifted on the crooked crosses and {{headstones||headstone||***n.*** (墓碑) a stone erected at the head of a grave, typically inscribed with the name of the deceased}}, on the spears of the little gate, on the barren thorns. His soul {{swooned||swoon||***v.*** (昏厥) faint from extreme emotion}} slowly as he heard the snow falling faintly through the universe and faintly falling, like the {{descent||descent||***n.*** (下降) an act of moving downwards, dropping, or falling||***de-*** (down) + ***scent*** (climb)||***scent*** (climb) →  a**scent** (上升)}} of their last end, upon all the living and the dead.'} />
						</div>
					</BentoCard>
				</div>

				<div className='flex flex-col basis-1/3 space-y-3'>
					<div className='flex-1'>
						<BentoCard title='Shared library' description='Distribute reading materials to your students.'>
							<div className={`h-28 w-full bg-gradient-to-br from-secondary-400 dark:from-secondary-300 dark:to-warning-400 to-warning-300 p-3 relative rounded-lg`}>
								<h2 className='font-bold opacity-50'>Study group:</h2>
								<p className='opacity-60 font-bold'>Xin Zhi</p>
								<div className='absolute bottom-0 right-0 p-4'>
									<MdOutlineGroupAdd className='w-10 h-10 opacity-30' />
								</div>
							</div>
						</BentoCard>
					</div>
					<div className='flex-1'>
						<BentoCard title='Notebook' description='Where the words you have saved come together'>
							<Test compact disableDel lib='f023219' latestTime={'2024-06-10'} />
						</BentoCard>
					</div>
				</div>
			</div>

			<div>
				<BentoCard title='Multilingual' description='Japanese, French ...'>
					<Markdown disableSave md={'<div/>\n> 自分は{{透き徹る||透き徹る||**［動］（すきとおる／透彻）**光が完全に通る。}}ほど深く見えるこの黒眼の色沢を眺めて、これでも死ぬのかと思った。それで、{{ねんごろ||ねんごろ||**［形動］（懇ろ／亲切）**心がこもっているさま。親切であるさま。}}に枕の傍へ口を付けて、死ぬんじゃなかろうね、大丈夫だろうね、とまた聞き返した。すると女は黒い眼を眠そうに{{睁た||睁る||**［動］（みはる／睁眼）**目を見開く。}}まま、やっぱり静かな声で、でも、死ぬんですもの、仕方がないわと云った。\n\n'} />
				</BentoCard>
			</div>
		</div>

		<Spacer y={12}></Spacer>

		<Fade>
			<H className={`${xw.className} text-6xl mb-4`}>
				Blog
			</H>
		</Fade>
		<div className='flex justify-center w-full'>
			<Link href={'https://blog.leximory.com/hello-leximory-hi-pxci'}>
				<img src='/blog.png' className='border-0 mx-auto w-full rounded shadow sm:w-[640px] overflow-hidden'></img>
			</Link>
		</div>

		<Spacer y={12}></Spacer>

		<Fade>
			<H className={`${xw.className} whitespace-pre-line text-6xl`}>
				{'From Cramming\nTo Input'}
			</H>
		</Fade>
		<div className='text-center space-x-1 mt-2'>
			<External size={'md'} link='/library/3e4f1126'>Experience our example library: The Crystals</External>
		</div>
	</Main>
}

const BentoCard = ({ title, children, description, }: {
	title: string,
	children: ReactNode,
	description?: string,
}) => {
	return <Card shadow='sm' className={`w-full h-full`}>
		<CardBody className='p-5'>
			<H className={`${xw.className} text-2xl ${!description && 'mb-2'}`} disableCenter>
				{title}
			</H>
			{description && <div className='text-sm mb-2'>{description}</div>}
			<div className='w-full h-full flex justify-center items-center'>
				{children}
			</div>
		</CardBody>
	</Card>
}
