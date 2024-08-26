'use client'
import { useCookies } from 'next-client-cookies'
import { usePathname } from 'next/navigation'
import { COOKIES_SUBDOMAINS_PATHNAME_NAME } from './constants'

export const useClientPathname = (): string => {
	const cookies = useCookies()
	const subdomainsPrefixPathname = cookies.get(COOKIES_SUBDOMAINS_PATHNAME_NAME)
	const _pathname = usePathname()

	const pathname = subdomainsPrefixPathname
		? subdomainsPrefixPathname + _pathname
		: _pathname

	return pathname.length > 1 && pathname.endsWith('/')
		? pathname.slice(0, -1)
		: pathname || ''
}
