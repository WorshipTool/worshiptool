import AppProviders from '@/app/components/AppProviders'
import UnavailableMessage from '@/app/components/UnavailableMessage'
import { GoogleAnalytics } from '@/app/components/components/GoogleAnalytics'
import HotjarAnalytics from '@/app/components/components/HotjarAnalytics'
import { DragTemplatesContainer } from '@/common/components/DragTemplate/DragTemplateContainer'
import PopupProvider from '@/common/components/Popup/PopupProvider'
import AdminOptionsProvider from '@/common/components/admin/AdminOptions'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'

import './globals.classes.css'
import './globals.css'
import './typography.globals.css'

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
		<html lang="en">
			<GoogleAnalytics />
			<HotjarAnalytics />
			<body>
				<AppRouterCacheProvider>
					<AppProviders>
						{children}
						<PopupProvider />
						<DragTemplatesContainer />
						<AdminOptionsProvider />
					</AppProviders>
					<UnavailableMessage />
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}
