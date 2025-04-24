import {
	CloudConfigs,
	cloudConfigsNames,
} from '@/common/providers/FeatureFlags/cloud-config/cloud-config.types'
import { useDynamicConfig } from '@statsig/react-bindings'

/**
 * Hook to get the value of a cloud prop (Dynamic config value) typed boolean.
 */
export const useCloudConfig = <
	T extends keyof CloudConfigs,
	R extends keyof CloudConfigs[T]
>(
	config: T,
	key: R,
	defaultValue: CloudConfigs[T][R]
): CloudConfigs[T][R] => {
	const a = useDynamicConfig(cloudConfigsNames[config])

	return (a.value[key as string] as CloudConfigs[T][R]) ?? defaultValue
}
