import type { Metadata } from 'next'
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
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
