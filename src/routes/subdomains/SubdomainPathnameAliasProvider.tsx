import { createContext, useContext, useState } from 'react'

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

type SubdomainData = {
	subdomain: string
	pathname: string
}

const useProvideSubdomainPathnameAlias = () => {
	const [aliases, setAliases] = useState<SubdomainData[]>([])

	const addAliases = (subdomains: SubdomainData[]) => {
		setAliases((prev) => {
			const newAliases = subdomains.filter(
				(newAlias) =>
					!prev.some((prevAlias) => prevAlias.subdomain === newAlias.subdomain)
			)
			return [...prev, ...newAliases]
		})
	}

	const removeAliases = (subdomains: SubdomainData[]) => {
		setAliases((prev) => {
			return prev.filter(
				(prevAlias) =>
					!subdomains.some(
						(newAlias) => newAlias.subdomain === prevAlias.subdomain
					)
			)
		})
	}

	return {
		addAliases,
		removeAliases,
		aliases,
	}
}
