import { FRONTEND_URL } from '@/api/constants'
import { routesPaths } from '@/routes/routes'
import { SubdomainData } from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import { getReplacedUrlWithParams } from '@/routes/tech/transformer.tech'

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

	const urlObject = new URL(leftStr, uo.origin)
	subdomains.reverse()
	subdomains.push(urlObject.hostname)
	urlObject.hostname = subdomains.join('.')

	// add search params
	urlObject.search = uo.search

	const str = urlObject.toString()

	return str
}

// Input url has to be absolute
// export const changeUrlFromSubdomains = (url: string): string => {
// 	const key = routesPaths.subdomain.split('/')[1]

// 	const uo = new URL(url, FRONTEND_URL)

// 	// get subdomains
// 	const subdomains = uo.hostname.split('.')
// 	subdomains.pop()

// 	const additional = subdomains
// 		.map((subdomain) => {
// 			return `${key}/${subdomain}`
// 		})
// 		.join('/')

// 	// Add to begining of pathname
// 	const pathname = uo.pathname

// 	// Get the base host
// 	const hostnameParts = uo.hostname.split('.')
// 	let baseHost: string

// 	if (
// 		hostnameParts.length === 1 ||
// 		hostnameParts[hostnameParts.length - 1].includes(':')
// 	) {
// 		baseHost = uo.host
// 	} else {
// 		baseHost = hostnameParts.slice(-2).join('.')
// 		if (uo.port && !baseHost.includes(':')) {
// 			baseHost += `:${uo.port}`
// 		}
// 	}

// 	const newOrigin = `${uo.protocol}//${baseHost}`
// 	console.log('newOrigin', newOrigin)

// 	const newUrl = new URL(additional + pathname, newOrigin)

// 	return newUrl.toString()
// }

/**
 * This function transform the url path with subdomain pathname aliases.
 * For example /sub/tymy/9r78ets can be transformed to /sub/13ka
 * It does not handle subdomains in url (only /sub/ format)
 *
 * @returns relative or absolute url, depens on the input url
 */
export const getUrlWithSubdomainPathnameAliases = (
	url: string,
	aliases: SubdomainData[]
) => {
	try {
		const isAbsolute = url.startsWith('http://') || url.startsWith('https://')
		const urlObject = new URL(url, isAbsolute ? undefined : FRONTEND_URL)
		const relativeUrl = urlObject.pathname
		for (const alias of aliases) {
			if (relativeUrl.startsWith(alias.pathname)) {
				const leftPart = relativeUrl.slice(alias.pathname.length)
				const subdomainUrl = getReplacedUrlWithParams(
					routesPaths.subdomain,
					{
						subdomain: alias.subdomain,
					},
					{
						returnFormat: 'relative',
						returnSubdomains: 'never',
					}
				)

				const allNewUrl = subdomainUrl.endsWith('/')
					? subdomainUrl.slice(0, -1) + leftPart
					: subdomainUrl + leftPart
				return isAbsolute
					? new URL(allNewUrl, urlObject.origin).toString()
					: allNewUrl
			}
		}
		return isAbsolute ? url : urlObject.pathname
	} catch (e) {
		console.log('getUrlWithSubdomainPathnameAliases error', e)
		return url
	}
}
