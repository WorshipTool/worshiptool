import { getApiClasses } from '@/hooks/api/tech'
import { useMemo } from 'react'
import useAuth from '../auth/useAuth'

export const useApi = () => {
	const { apiConfiguration } = useAuth()

	const apis = useMemo(
		() => getApiClasses(apiConfiguration),
		[apiConfiguration]
	)

	return apis
}
