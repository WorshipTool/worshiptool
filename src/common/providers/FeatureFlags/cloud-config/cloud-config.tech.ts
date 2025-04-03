import {
	BASIC_CLOUD_CONFIG_NAME,
	BasicCloudConfig,
} from '@/common/providers/FeatureFlags/cloud-config/cloud-config.types'
import { userDtoToStatsigUser } from '@/common/providers/FeatureFlags/flags.tech'
import { ensureStatsigInitialized } from '@/common/providers/FeatureFlags/statsig/statsig.config'
import { UserDto } from '@/interfaces/user'
import Statsig from 'statsig-node'

export const getCloudConfig = async <T extends keyof BasicCloudConfig>(
	key: T,
	defaultValue: BasicCloudConfig[T],
	user?: UserDto
): Promise<BasicCloudConfig[T]> => {
	await ensureStatsigInitialized()

	const config = Statsig.getConfig(
		userDtoToStatsigUser(user),
		BASIC_CLOUD_CONFIG_NAME
	)

	const value = (config.value[key] as BasicCloudConfig[T]) ?? defaultValue
	return value
}
