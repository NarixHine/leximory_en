import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import Navbar from '@/components/navbar'
import { eng, cn } from '@/lib/fonts'
import { Analytics } from '@vercel/analytics/next'
import Footer from '@/components/footer'
import { UrlPrefix } from '@/lib/config'

const TITLE_DEFAULT = 'Leximory'
const TITLE_TEMPLATE = `%s | ${TITLE_DEFAULT}`
const APP_DESCRIPTION = 'Learn languages the right way'

export const metadata: Metadata = {
	applicationName: TITLE_DEFAULT,
	metadataBase: new URL(UrlPrefix),
	title: {
		default: TITLE_DEFAULT,
		template: TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: TITLE_DEFAULT
	},
	manifest: '/manifest.json',
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: 'website',
		siteName: TITLE_DEFAULT,
		title: {
			default: TITLE_DEFAULT,
			template: TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
}

export const viewport: Viewport = {
	themeColor: '#FAFDF6',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const fonts = [eng.style.fontFamily, cn.style.fontFamily]
	return (
		<html lang='en-GB'>
			<body style={{
				fontFamily: fonts.join(','),
			}}>
				<Providers themeProps={{ attribute: 'class', enableSystem: true }}>
					<div className='relative flex flex-col'>
						<Navbar />
						{children}
						<Footer></Footer>
					</div>
				</Providers>
				<Analytics />
			</body>
		</html>
	)
}
