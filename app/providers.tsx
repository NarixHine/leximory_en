'use client'

import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { useSystemColorMode } from 'react-use-system-color-mode'
import { dark } from '@clerk/themes'
import ReaderModeProvider from '@/components/reader'
import { Toaster } from 'sonner'

export interface ProvidersProps {
	children: ReactNode
	themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter()
	const mode = useSystemColorMode()
	return (
		<ClerkProvider appearance={{ baseTheme: mode === 'dark' ? dark : undefined }}>
			<NextUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
					<Toaster toastOptions={{
						classNames: {
							toast: 'bg-primary-200 text-primary-900 dark:bg-danger-800 dark:border-0 dark:text-primary-100',
						}
					}}></Toaster>
					<ReaderModeProvider>
						{children}
					</ReaderModeProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</ClerkProvider>
	)
}
