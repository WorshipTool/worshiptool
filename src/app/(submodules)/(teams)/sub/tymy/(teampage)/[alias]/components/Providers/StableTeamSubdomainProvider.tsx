'use client'
import { useCommonData } from '@/hooks/common-data/useCommonData'
import { getRouteUrlWithParams } from '@/routes/routes.tech'
import useSubdomainPathnameAlias from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import React, { useEffect } from 'react'

type StableSubdomainLinkProviderProps = {
	children: React.ReactNode
}

export default function StableTeamSubdomainProvider(
	props: StableSubdomainLinkProviderProps
) {
	const { addAliases } = useSubdomainPathnameAlias()

	const aliases = useCommonData('allsubdomains')

	useEffect(() => {
		if (aliases.length === 0) return
		const newAliases = aliases.map((alias) => {
			const url = getRouteUrlWithParams(
				'team',
				{ alias: alias.teamAlias },
				{
					subdomains: false,
					relative: true,
				}
			)

			return {
				subdomain: alias.subdomain,
				pathname: url,
			}
		})

		addAliases(newAliases)
	}, [aliases])

	return <>{props.children}</>
}
