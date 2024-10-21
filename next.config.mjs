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
		return []
	},

	images: {
		domains: ['localhost'],
	},

	reactStrictMode: false,
	output: 'standalone',
})

export default nextConfig
