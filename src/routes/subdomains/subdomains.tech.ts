import { routesPaths } from '@/routes/routes'

export const getSubdomains = (host?: string | null) => {
	let subdomains: string[] = []
	if (!host && typeof window !== 'undefined') {
		// On client side, get the host from window
		host = window.location.host
	}
	if (host && host.includes('.')) {
		const parts = host.split('.')
		if (parts.length > 1) {
			// Valid candidate
			const local = parts.at(-1)?.includes('localhost')
			subdomains = parts.slice(0, local ? -1 : -2)
		}
	}
	return subdomains
}

export const addSubdomainToPathname = (pathname: string, subdomain: string) => {
	const key = routesPaths.subdomain.split('/')[1]

	const subdomainStart = `/${key}/${subdomain}`

	return subdomainStart + pathname
}
