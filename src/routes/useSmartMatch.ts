'use client'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { urlMatchPatterns } from '@/routes/routes.tech'
import { routesPaths } from './routes'
import { RoutesKeys } from './routes.types'

export const useSmartMatch = <T extends RoutesKeys>(location: T) => {
	const pattern = routesPaths[location]

	const pathname = useClientPathname()
	return urlMatchPatterns(pathname, pattern)
}
