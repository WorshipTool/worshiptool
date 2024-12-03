import Head from 'next/head'

export default function HeadersProviders() {
	return (
		<Head>
			{/* Preconnect to Google Fonts */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				// crossorigin="anonymous"
			/>

			{/* DNS Prefetch for Google Fonts */}
			<link rel="dns-prefetch" href="//fonts.googleapis.com" />
			<link rel="dns-prefetch" href="//fonts.gstatic.com" />
		</Head>
	)
}
