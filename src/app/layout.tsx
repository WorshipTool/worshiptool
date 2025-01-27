import AppProviders from '@/app/components/AppProviders'
import UnavailableMessage from '@/app/components/UnavailableMessage'
import { DragTemplatesContainer } from '@/common/components/DragTemplate/DragTemplateContainer'
import PopupProvider from '@/common/components/Popup/PopupProvider'
import AdminOptionsProvider from '@/common/components/admin/AdminOptions'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'

import Analytics from '@/app/components/components/analytics/Analytics'
import HeadersProviders from '@/app/providers/HeadersProviders'
import './globals.classes.css'
import './globals.css'

export const metadata: Metadata = {
	title: 'Chvalotce.cz',
	description: 'Uživatelsky přívětivá platforma s křesťanskými chválami',
	keywords: [
		'zpěvník',
		'chvály',
		'akordy',
		'píseň',
		'text',
		'playlist',
		'křesťanské',
		'hudba',
	],
	manifest: '/src/app/manifest.json',
	verification: {
		google: 'yvbr9ieSeuhugyZcK93MS5Mm3DgYMXqK1EUHYXEHEWs',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="cs">
			<HeadersProviders />
			<Analytics />
			<body>
				<AppRouterCacheProvider>
					<AppProviders>
						{children}
						<PopupProvider />
						<DragTemplatesContainer />
						<AdminOptionsProvider />

						<UnavailableMessage />
					</AppProviders>
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}
