import { FRONTEND_URL } from '@/api/constants'
import { routesPaths } from '@/routes/routes'

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
