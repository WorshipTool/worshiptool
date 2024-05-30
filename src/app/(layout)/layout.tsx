import { AppContainer } from '../components/AppContainer'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <AppContainer>{children}</AppContainer>
}
