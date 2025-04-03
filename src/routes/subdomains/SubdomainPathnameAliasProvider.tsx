import { useCommonData } from '@/hooks/common-data/useCommonData'

import { getRouteUrlWithParams } from '@/routes/tech/transformer.tech'
import { createContext, useContext, useMemo } from 'react'

type Rt = ReturnType<typeof useProvideSubdomainPathnameAlias>

const subdomainContext = createContext<Rt>({ uninitialized: true } as any as Rt)

export function SubdomainPathnameAliasProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const value = useProvideSubdomainPathnameAlias()
	return (
		<subdomainContext.Provider value={value}>
			{children}
		</subdomainContext.Provider>
	)
}

export default function useSubdomainPathnameAlias() {
	const r = useContext(subdomainContext)

	if ((r as any).uninitialized) {
		throw new Error(
			'useSubdomainPathnameAlias was used outside of a SubdomainPathnameAliasProvider'
		)
	}

	return r
}

export type SubdomainData = {
	subdomain: string
	pathname: string
}

const useProvideSubdomainPathnameAlias = () => {
	const d = useCommonData('allsubdomains')
	const aliases = useMemo(() => {
		return d.map((alias) => {
			const url = getRouteUrlWithParams(
				'team',
				{ alias: alias.teamAlias },
				{
					returnSubdomains: 'never',
					returnFormat: 'relative',
				}
			)

			return {
				subdomain: alias.subdomain,
				pathname: url,
			}
		})
	}, [d])

	return {
		aliases,
	}
}
