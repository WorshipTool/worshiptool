import { CloudNumber } from '@/common/providers/FeatureFlags/flags.types'
import { useParameterStore } from '@statsig/react-bindings'
import { useEffect, useState } from 'react'

/**
 * Hook to get the value of a feature flag typed number.
 * @param key The key of the feature flag number.
 * @returns The value of the feature flag and a loading state.
 */
export function useCloudNumber(key: CloudNumber, defaultValue: number) {
	const a = useParameterStore('global')

	const [value, setValue] = useState<number | null>(defaultValue)

	useEffect(() => {
		const v = a.get<number>(key as string)
		setValue(v ?? defaultValue)
	}, [a, key, defaultValue])

	return value
}
