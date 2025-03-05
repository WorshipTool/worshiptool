import { userDtoToConfigCatUser } from '@/common/providers/FeatureFlags/flags.tech'
import { CloudNumber } from '@/common/providers/FeatureFlags/flags.types'
import useAuth from '@/hooks/auth/useAuth'
import { useFeatureFlag } from 'configcat-react'
import { useMemo } from 'react'

/**
 * Hook to get the value of a feature flag typed number.
 * @param key The key of the feature flag number.
 * @returns The value of the feature flag and a loading state.
 */
export function useCloudNumber(key: CloudNumber, defaultValue: number) {
	const { user } = useAuth()

	const userObject = useMemo(() => {
		if (!user) return undefined
		return userDtoToConfigCatUser(user)
	}, [user])

	const data = useFeatureFlag(key as string, defaultValue, userObject)

	return data
}
