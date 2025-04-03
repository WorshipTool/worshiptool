import { StatsigClient } from '@statsig/js-client'
import nextRoutes from 'nextjs-routes/config'
const withRoutes = nextRoutes()

// @ts-check
export default async (phase, { defaultConfig }) => {
	const checkFlag = async (key) => {
		const myStatsigClient = new StatsigClient(
			process.env.NEXT_PUBLIC_STATSIG_API_KEY,
			{},
			{
				environment: {
					tier:
						process.env.NODE_ENV === 'development'
							? 'development'
							: 'production',
				},
			}
		)
		await myStatsigClient.initializeAsync()

		return myStatsigClient.checkGate(key)
	}

	const useSubdomains = await checkFlag('use_subdomains')

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
		env: {
			useSubdomains: useSubdomains ? 'true' : 'false',
		},
	})
	return nextConfig
}
