import { FRONTEND_URL } from '@/api/constants'
import { routesPaths } from '@/routes'
import { getReplacedUrlWithParams } from '@/routes/routes.tech'
import { SubdomainData } from '@/routes/subdomains/SubdomainPathnameAliasProvider'

export const getUrlWithSubdomainPathnameAliases = (
	url: string,
	aliases: SubdomainData[]
) => {
	try {
		const urlObject = new URL(url, FRONTEND_URL)
		const relativeUrl = urlObject.pathname
		for (const alias of aliases) {
			if (relativeUrl.startsWith(alias.pathname)) {
				const leftPart = relativeUrl.slice(alias.pathname.length)
				const subdomainUrl = getReplacedUrlWithParams(routesPaths.subdomain, {
					subdomain: alias.subdomain,
				})

				const allNewUrl = subdomainUrl.endsWith('/')
					? subdomainUrl.slice(0, -1) + leftPart
					: subdomainUrl + leftPart
				return allNewUrl
			}
		}
		return url
	} catch (e) {
		return url
	}
}
