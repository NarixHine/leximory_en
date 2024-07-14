import Main from '@/components/main'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <Main className='heti'>
		{children}
	</Main>
}
