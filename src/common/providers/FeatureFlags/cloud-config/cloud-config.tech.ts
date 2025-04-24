import { CloudConfigs } from '@/common/providers/FeatureFlags/cloud-config/cloud-config.types'
import { userDtoToStatsigUser } from '@/common/providers/FeatureFlags/flags.tech'
import { ensureStatsigInitialized } from '@/common/providers/FeatureFlags/statsig/statsig.config'
import { UserDto } from '@/interfaces/user'
import Statsig from 'statsig-node'

export const getCloudConfig = async <
	T extends keyof CloudConfigs,
	R extends keyof CloudConfigs[T]
>(
	configName: T,
	key: R,
	defaultValue: CloudConfigs[T][R],
	user?: UserDto
): Promise<CloudConfigs[T][R]> => {
	await ensureStatsigInitialized()

	const config = Statsig.getConfig(userDtoToStatsigUser(user), configName)

	const value =
		(config.value[key as string] as CloudConfigs[T][R]) ?? defaultValue
	return value
}
