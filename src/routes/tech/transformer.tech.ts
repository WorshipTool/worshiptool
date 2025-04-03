import { FRONTEND_URL } from '@/api/constants'
import { routesPaths } from '@/routes/routes'
import { ParamValueType, RoutesKeys, SmartParams } from '@/routes/routes.types'
import { shouldUseSubdomains } from '@/routes/tech/routes.tech'
import { changeUrlToSubdomains } from '@/routes/tech/subdomains.tech'

/**
 * Get url from pretyped-route with given parameters.
 */
export const getRouteUrlWithParams = <T extends RoutesKeys>(
	page: T,
	params: SmartParams<T>,
	options?: GetReplacedUrlWithParamsOptions
) => {
	const url = routesPaths[page]
	let result = getReplacedUrlWithParams(FRONTEND_URL + url, params, options)

	return result
}

/**
 * Options for generating a replaced URL with parameters.
 *
 * @property subdomains - Whether to return url as subdomains.
 */
type GetReplacedUrlWithParamsOptions = {
	returnSubdomains?: 'auto' | 'never'
	returnFormat?: 'absolute' | 'relative'
}

/**
 * Generates a URL with replaced parameters and optional query parameters.
 * It also transform subdomains if needed.
 * Warning: It does not handle subdomain aliases!
 */
export const getReplacedUrlWithParams = (
	url: string,
	params: { [key: string]: ParamValueType | undefined },
	_options: GetReplacedUrlWithParamsOptions = {}
) => {
	// Defaults
	const options = {
		returnSubdomains: 'auto',
		returnFormat: 'absolute',
		..._options,
	}

	const returnAbsolute = options.returnFormat === 'absolute'
	const _subdomains = options.returnSubdomains === 'auto'
	const subdomains = _subdomains ? shouldUseSubdomains() : _subdomains // If auto, func transform subdomains in

	// Check options
	if (!returnAbsolute && _subdomains)
		throw new Error('Cannot use subdomains without absolute url')

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
	if (subdomains) {
		result = changeUrlToSubdomains(result)
	}

	// Make sure its absolute or relative
	const _url = new URL(result, FRONTEND_URL)
	if (returnAbsolute) {
		return _url.toString()
	}
	return _url.pathname
}
