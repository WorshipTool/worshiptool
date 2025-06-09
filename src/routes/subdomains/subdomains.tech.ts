import { FRONTEND_URL } from '@/api/constants'

export const getSubdomains = (host?: string | null) => {
	let subdomains: string[] = []

	if (!host && typeof window !== 'undefined') {
		// On client side, get the host from window
		host = window.location.host
	}

	let frontendParts: string[] = []

	try {
		const url = new URL(FRONTEND_URL)
		frontendParts = url.hostname.split('.')
	} catch {
		// ignore invalid FRONTEND_URL
	}

	if (host && host.includes('.')) {
		const parts = host.split('.')
		const isLocal = parts.at(-1)?.includes('localhost')

		// Compare with FRONTEND_URL parts
		const domainBaseLength = isLocal ? 1 : frontendParts.length
		subdomains = parts.slice(0, -domainBaseLength)
	}

	return subdomains
}
