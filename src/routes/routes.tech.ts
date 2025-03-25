import { FRONTEND_URL } from '@/api/constants'
import { VariantPackAlias } from '@/api/dtos'
import { routesPaths } from '@/routes/routes'
import {
	ParamValueType,
	RoutesKeys,
	SmartAllParams,
	SmartParams,
} from '@/routes/routes.types'

export const shouldUseSubdomains = () =>
	process.env.NEXT_PUBLIC_DONT_USE_SUBDOMAINS !== 'true'

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

export const changeUrlToSubdomains = (url: string): string => {
	// if the url is /sub/A/sub/B..., return B.A....
	const key = routesPaths.subdomain.split('/')[1]

	const uo = new URL(url, FRONTEND_URL)
	const pathname = uo.pathname

	const urlParts = pathname.split('/').filter((part) => part !== '')

	const subdomains = []

	let lastIndex = -1
	for (let i = 0; i < urlParts.length; i++) {
		if (urlParts[i] === key && urlParts[i + 1]) {
			subdomains.push(urlParts[i + 1])
			i++
			lastIndex = i + 1
		} else {
			break
		}
	}

	const leftParts = urlParts.slice(lastIndex < 0 ? 0 : lastIndex)

	const leftStr = leftParts.join('/')

	const urlObject = new URL(leftStr, FRONTEND_URL)
	subdomains.reverse()
	subdomains.push(urlObject.hostname)
	urlObject.hostname = subdomains.join('.')

	// add search params
	urlObject.search = uo.search

	const str = urlObject.toString()

	return str
}

// Input url has to be absolute
export const changeUrlFromSubdomains = (url: string): string => {
	const key = routesPaths.subdomain.split('/')[1]

	const uo = new URL(url)

	// get subdomains
	const subdomains = uo.hostname.split('.')
	subdomains.pop()

	const additional = subdomains
		.map((subdomain) => {
			return `${key}/${subdomain}`
		})
		.join('/')

	// Add to begining of pathname
	const pathname = uo.pathname
	const newUrl = new URL(additional + pathname, FRONTEND_URL)

	return newUrl.toString()
}

type GetReplacedUrlWithParamsOptions = {
	subdomains?: boolean
	absolute?: boolean
	relative?: boolean
}

export const getReplacedUrlWithParams = (
	url: string,
	params: { [key: string]: ParamValueType | undefined },
	options: GetReplacedUrlWithParamsOptions = {
		subdomains: true,
		absolute: true,
	}
) => {
	// Check options
	if (!options.absolute && options.subdomains)
		throw new Error('Cannot use subdomains without absolute url')
	if (options.relative !== undefined) options.absolute = !options.relative

	const queryParams: Record<string, ParamValueType> = {}

	// Process params
	let result = url
	for (const key in params) {
		// Ignore undefined values
		if (params[key] === undefined) continue
		if (typeof params[key] !== 'string' && typeof params[key] !== 'boolean')
			continue

		const initial = result
		result = result.replace(`[${key}]`, params[key] as string)
		if (initial === result) {
			queryParams[key] = params[key] as string
		}
	}

	// Handling query params
	if (Object.keys(queryParams).length > 0) {
		const url = new URL(result, FRONTEND_URL)
		for (const key in queryParams) {
			const val = queryParams[key]
			if (typeof val === 'string') url.searchParams.set(key, val)
			else if (typeof val === 'boolean')
				url.searchParams.set(key, val.toString())
		}
		result = url.toString()
	}

	// Handling subdomains
	if (options?.subdomains && shouldUseSubdomains()) {
		result = changeUrlToSubdomains(result)
	}

	// Make sure its absolute or relative
	const _url = new URL(result, FRONTEND_URL)
	if (options?.absolute) {
		return _url.toString()
	}
	return _url.pathname
}

export const getRouteUrlWithParams = <T extends RoutesKeys>(
	page: T,
	params: SmartParams<T>,
	options?: GetReplacedUrlWithParamsOptions
) => {
	const url = routesPaths[page]
	let result = getReplacedUrlWithParams(FRONTEND_URL + url, params, options)

	return result
}

export const parseVariantAlias = (variantAlias: VariantPackAlias) => {
	const alias = variantAlias

	// Part before first -
	const hex = alias.split('-')[0]
	// Part after first - to the end
	const code = alias.split('-').slice(1).join('-')

	return { hex, alias: code }
}

export const makeVariantAlias = (hex: string, code: string) => {
	return `${hex}-${code}`
}

export const getPathnameFromUrl = (url: string): string => {
	// get with regex
	const regex = /https?:\/\/[^/]+(\/.*)/

	const match = url.match(regex)
	if (!match) return ''

	return match[1]
}
