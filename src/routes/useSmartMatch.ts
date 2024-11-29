'use client'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { urlMatchPatterns } from '@/routes/routes.tech'
import { routesPaths } from './routes'
import { RoutesKeys } from './routes.types'

export const useSmartMatch = <T extends RoutesKeys>(location: T | null) => {
	const pattern = location ? routesPaths[location] : null

	const pathname = useClientPathname()
	return pattern ? urlMatchPatterns(pathname, pattern) : false
}
