import { AppContainer } from '../components/AppContainer'
import AppProviders from '../components/AppProviders'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AppProviders>
			<AppContainer>{children}</AppContainer>
		</AppProviders>
	)
}
