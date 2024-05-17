import type { Metadata } from 'next'
import { AppContainer } from './components/AppContainer'
import AppProviders from './components/AppProviders'
import './globals.css'

export const metadata: Metadata = {
	title: 'Chvalotce.cz',
	description: 'Uživatelsky přívětivá platforma s křesťanskými chválam',
	manifest: '/src/app/manifest.json',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<AppProviders>
					<AppContainer>{children}</AppContainer>
				</AppProviders>
			</body>
		</html>
	)
}
