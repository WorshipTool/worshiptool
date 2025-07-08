import nextRoutes from 'nextjs-routes/config'
const withRoutes = nextRoutes()

// @ts-check
// eslint-disable-next-line import/no-anonymous-default-export
export default (phase, { defaultConfig }) => {
	/** @type {import('next').NextConfig} */
	const nextConfig = withRoutes({
		webpack(config) {
			config.module.rules.push({
				test: /\.svg$/,
				use: ['@svgr/webpack'],
			})
			return config
		},
		redirects() {
			return [
				{
					source: '/p/:hex/:alias',
					destination: '/pisen/:hex/:alias',
					permanent: true,
				},
			]
		},

		rewrites() {
			return []
		},

		images: {
			remotePatterns: [
				{
					hostname: 'localhost',
				},
				{
					hostname: 'test-chvalotce.cz',
				},
				{
					hostname: 'chvalotce.cz',
				},
				{
					hostname: 'worship.cz',
				},
				{
					hostname: 'worshiptool-end.fly.dev',
				},
				...(process.env.NEXT_PUBLIC_BACKEND_URL
					? [
							{
								hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_URL).hostname,
							},
					  ]
					: []),
				...(process.env.NEXT_PUBLIC_FRONTEND_URL
					? [
							{
								hostname: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL)
									.hostname,
							},
					  ]
					: []),
				
			],
			dangerouslyAllowSVG: true,
		},
		headers() {
			return [
				{
					// Nastavení hlavičky pro všechny cesty
					source: '/(.*)',
					headers: [
						{
							key: 'Referrer-Policy',
							value: 'strict-origin-when-cross-origin',
						},
					],
				},
			]
		},
		reactStrictMode: false,
		output: 'standalone',
		env: {
			useSubdomains: process.env.USE_SUBDOMAINS || 'false',
		},
	})
	return nextConfig
}
