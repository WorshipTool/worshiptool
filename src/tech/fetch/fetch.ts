import { FunctionProps } from '@/types/common.types'

const SAFE_API_HOSTS = ['chvalotce.cz']

const isSafeUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url)
		return (
			SAFE_API_HOSTS.includes(parsedUrl.hostname) &&
			parsedUrl.protocol === 'https:'
		)
	} catch (e) {
		return false
	}
}

export const safeFetch = async (...p: FunctionProps<typeof fetch>) => {
	const url = p[0] as string
	if (!isSafeUrl(url)) {
		throw new Error(`Unsafe URL detected: ${url}`)
	}
	return fetch(...p)
}
