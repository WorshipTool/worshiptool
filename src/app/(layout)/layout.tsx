import { AppContainer } from '@/app/components/AppContainer'
import { Background } from '@/common'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Background />
			<AppContainer>{children}</AppContainer>
		</>
	)
}
