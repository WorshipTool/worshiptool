import { FRONTEND_URL } from '@/api/constants'
import { UserDto } from '@/interfaces/user'
import { routesPaths } from '@/routes/routes'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'

/**
 * Its possible to send user, but its not used
 * UseSubdomain flag is not possible use more dynamicly, beacuse this func is used in middleware also
 * */
export const shouldUseSubdomains = (user?: UserDto) => {
	return process.env.NEXT_PUBLIC_USE_SUBDOMAINS?.toLocaleLowerCase() === 'true'
}

export const urlMatchPatterns = (
	pathname: string,
	pattern: string,
	parental: boolean = false
) => {
	// make sure that pathname is relative
	if (pathname.startsWith(FRONTEND_URL)) {
		pathname = pathname.slice(FRONTEND_URL.length)
	}

	const urlParts = pathname.split('/')
	const patternParts = pattern.split('/')

	if (urlParts.length < patternParts.length) return false

	if (!parental && urlParts.length !== patternParts.length) return false

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

export const getPathnameFromUrl = (url: string): string => {
	// get with regex
	const regex = /https?:\/\/[^/]+(\/.*)/

	const match = url.match(regex)
	if (!match) return ''

	return match[1]
}
