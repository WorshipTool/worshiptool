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

	reactStrictMode: true,
})

export default nextConfig
