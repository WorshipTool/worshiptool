'use client'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { routesPaths } from './routes'
import { RoutesKeys } from './routes.types'

// url can be http://localhost:5500/playlist/13bedb3a-eaaa-4a88-ac70-e14f37787a70
// pattern can be "/playlist/[guid]"
// returns boolean
const urlMatchPatterns = (pathname: string, pattern: string) => {
	const urlParts = pathname.split('/')
	const patternParts = pattern.split('/')

	if (urlParts.length !== patternParts.length) return false

	for (let i = 0; i < patternParts.length; i++) {
		const part = patternParts[i]
		if (part.startsWith('[')) continue
		if (part !== urlParts[i]) return false
	}

	return true
}

export const useSmartMatch = <T extends RoutesKeys>(location: T) => {
	const pattern = routesPaths[location]

	const pathname = useClientPathname()
	console.log(pathname, pattern)
	return urlMatchPatterns(pathname, pattern)
}
