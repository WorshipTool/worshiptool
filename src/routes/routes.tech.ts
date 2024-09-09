import { routesPaths } from '@/routes/routes'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'

export const shouldUseSubdomains = () =>
	process.env.NEXT_PUBLIC_DONT_USE_SUBDOMAINS !== 'true'

export const urlMatchPatterns = (pathname: string, pattern: string) => {
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

export const getParamsFromPathnameWithRoutePattern = (
	pathname: string,
	pattern: string
): Record<string, any> => {
	//Patern is for example "/playlist/[guid]";
	//Pathname is for example /playlist/13bedb3a-eaaa-4a88-ac70-e14f37787a70
	// params = { guid: '13bedb3a-eaaa-4a88-ac70-e14f37787a70' }

	const urlParts = pathname.split('/')
	const patternParts = pattern.split('/')

	if (patternParts.length > urlParts.length) return {}

	const params: Record<string, string> = {}

	for (let i = 0; i < patternParts.length; i++) {
		const part = patternParts[i]
		if (part.startsWith('[') && part.endsWith(']')) {
			const key = part.slice(1, -1)
			params[key] = urlParts[i]
		}
	}
	return params
}

export const getSmartParamsFromRoutePattern = <T extends RoutesKeys>(
	pathname: string,
	pattern: T
): SmartAllParams<T> => {
	return getParamsFromPathnameWithRoutePattern(
		pathname,
		routesPaths[pattern]
	) as SmartAllParams<T>
}
