import { logServerError } from '@/tech/logging/logServerError'
import { FunctionProps } from '@/types/common.types'

const SAFE_API_HOSTS = ['chvalotce.cz', 'localhost', 'worship.cz', 'fly.dev']

const isSafeUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url)
		return (
			parsedUrl.hostname === 'localhost' ||
			(SAFE_API_HOSTS.includes(parsedUrl.hostname) &&
				parsedUrl.protocol === 'https:')
		)
	} catch (e) {
		return false
	}
}

export const safeFetch = async (...p: FunctionProps<typeof fetch>) => {
	const url = p[0] as string
	if (!isSafeUrl(url)) {
		logServerError('Unsafe URL detected', url)
	}
	return fetch(...p)
}
