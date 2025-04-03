'use server'
import { useServerPathname } from '@/hooks/pathname/useServerPathname'
import { urlMatchPatterns } from '@/routes/tech/routes.tech'
import { routesPaths } from './routes'
import { RoutesKeys } from './routes.types'

export const useSmartServerMatch = async <T extends RoutesKeys>(
	location: T
) => {
	const pattern = routesPaths[location]

	const pathname = await useServerPathname()
	return urlMatchPatterns(pathname, pattern)
}
