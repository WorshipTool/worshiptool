import { getApiClasses } from '@/api/tech-and-hooks/api-classes'
import { useMemo } from 'react'
import useAuth from '../../hooks/auth/useAuth'

export const useApi = () => {
	const { apiConfiguration } = useAuth()

	const apis = useMemo(
		() => getApiClasses(apiConfiguration),
		[apiConfiguration]
	)

	return apis
}
