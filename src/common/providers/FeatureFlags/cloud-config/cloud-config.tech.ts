import {
	BASIC_CLOUD_CONFIG_NAME,
	BasicCloudConfig,
} from '@/common/providers/FeatureFlags/cloud-config/cloud-config.types'
import { userDtoToStatsigUser } from '@/common/providers/FeatureFlags/flags.tech'
import { UserDto } from '@/interfaces/user'
import { StatsigClient } from '@statsig/js-client'
import { getEnvironmentStatsigConfig } from '../flags.tech'

export const getCloudConfig = async <T extends keyof BasicCloudConfig>(
	key: T,
	defaultValue: BasicCloudConfig[T],
	user?: UserDto
): Promise<BasicCloudConfig[T]> => {
	const myStatsigClient = new StatsigClient(
		process.env.NEXT_PUBLIC_STATSIG_API_KEY,
		user ? userDtoToStatsigUser(user) : {},
		{
			...getEnvironmentStatsigConfig(),
		}
	)

	await myStatsigClient.initializeAsync()

	const config = myStatsigClient.getDynamicConfig(BASIC_CLOUD_CONFIG_NAME)

	const value = (config.value[key] as BasicCloudConfig[T]) ?? defaultValue
	return value
}
