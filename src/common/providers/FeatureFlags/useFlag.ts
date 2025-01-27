import { userDtoToConfigCatUser } from '@/common/providers/FeatureFlags/flags.tech'
import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import useAuth from '@/hooks/auth/useAuth'
import { useFeatureFlag } from 'configcat-react'
import { useMemo } from 'react'

/**
 * Hook to get the value of a feature flag.
 * @param key The key of the feature flag.
 * @returns The value of the feature flag and a loading state.
 */
export function useFlag(key: FeatureFlag) {
	const { user } = useAuth()

	const userObject = useMemo(() => {
		if (!user) return undefined
		return userDtoToConfigCatUser(user)
	}, [user])

	const data = useFeatureFlag(key as string, false, userObject)

	return data
}
