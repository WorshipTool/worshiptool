import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { useGateValue } from '@statsig/react-bindings'

/**
 * Hook to get the value of a feature flag.
 * @param key The key of the feature flag.
 * @returns The value of the feature flag and a loading state.
 */
export function useFlag(key: FeatureFlag) {
	const data = useGateValue(key as string, {})

	return data
}
