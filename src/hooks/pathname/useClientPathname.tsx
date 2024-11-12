'use client'
import { useClientHostname } from '@/hooks/pathname/useClientHostname'
import { getPathnameFromUrl, getRouteUrlWithParams } from '@/routes/routes.tech'
import useSubdomainPathnameAlias from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import { getSubdomains } from '@/routes/subdomains/subdomains.tech'
import { useCookies } from 'next-client-cookies'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { COOKIES_SUBDOMAINS_PATHNAME_NAME } from './constants'

const cutPathname = (url: string) =>
	url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url

export const useClientPathname = (): string => {
	const cookies = useCookies()
	const { aliases } = useSubdomainPathnameAlias()
	const _pathname = usePathname()

	const hostname = useClientHostname()
	const subdomains = getSubdomains(hostname)

	const pathname = useMemo(() => {
		const subdomainsPrefixPathname = cookies.get(
			COOKIES_SUBDOMAINS_PATHNAME_NAME
		)

		const pathname = subdomainsPrefixPathname
			? subdomainsPrefixPathname + _pathname
			: _pathname

		let appliedAliases = pathname
		let found = false
		const subdomain = subdomains.join('.')
		for (const alias of aliases) {
			if (subdomain === alias.subdomain) {
				appliedAliases = alias.pathname + appliedAliases
				found = true
				break
			}
		}

		if (!found && subdomain) {
			const url =
				getRouteUrlWithParams(
					'subdomain',
					{ subdomain },
					{
						subdomains: false,
					}
				) + appliedAliases
			appliedAliases = getPathnameFromUrl(url)
		}

		return cutPathname(appliedAliases)
	}, [aliases, _pathname, subdomains])

	return pathname
}
