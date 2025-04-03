import { FRONTEND_URL } from '@/api/constants'
import { routesPaths } from '@/routes'
import { SubdomainData } from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import { getReplacedUrlWithParams } from '@/routes/tech/transformer.tech'

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
			console.log(relativeUrl, alias.pathname)
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
					? new URL(allNewUrl, FRONTEND_URL).toString()
					: allNewUrl
			}
		}
		return isAbsolute ? url : urlObject.pathname
	} catch (e) {
		console.log('getUrlWithSubdomainPathnameAliases error', e)
		return url
	}
}
