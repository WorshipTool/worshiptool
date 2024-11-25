import nextRoutes from 'nextjs-routes/config'
const withRoutes = nextRoutes()

/** @type {import('next').NextConfig} */
const nextConfig = withRoutes({
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})
		return config
	},
	async redirects() {
		return [
			{
				source: '/p/:hex/:alias',
				destination: '/pisen/:hex/:alias',
				permanent: true,
			},
		]
	},

	async rewrites() {
		return [
			{
				source: '/sub/tymy/5eatrh6/nahravky',
				destination: '/sites/13ka-records.html',
			},
		]
	},

	images: {
		remotePatterns: [
			{
				hostname: 'localhost',
			},
			{
				hostname: 'chvalotce.cz',
			},
		],
		dangerouslyAllowSVG: true,
	},
	async headers() {
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
})

export default nextConfig
