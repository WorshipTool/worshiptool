import { ApiClasses, getApiClasses } from '@/api/tech-and-hooks/api-classes'
import { useMemo } from 'react'
import useAuth from '../../hooks/auth/useAuth'
export function useApi(): ApiClasses
export function useApi<K extends keyof ApiClasses>(name: K): ApiClasses[K]
export function useApi<K extends keyof ApiClasses>(name?: K) {
	const { apiConfiguration } = useAuth()

	const apis = useMemo(
		() => getApiClasses(apiConfiguration),
		[apiConfiguration]
	)

	return name ? apis[name] : apis
}
