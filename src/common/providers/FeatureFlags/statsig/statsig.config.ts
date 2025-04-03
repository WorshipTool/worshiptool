import { getEnvironmentStatsigConfig } from '@/common/providers/FeatureFlags/flags.tech'
import Statsig from 'statsig-node'

let initialized = false
export const ensureStatsigInitialized = async () => {
	if (!initialized) {
		await Statsig.initialize(process.env.STATSTIG_SERVER_SECRET_KEY, {
			...getEnvironmentStatsigConfig(),
		})
		initialized = true
	}
}
