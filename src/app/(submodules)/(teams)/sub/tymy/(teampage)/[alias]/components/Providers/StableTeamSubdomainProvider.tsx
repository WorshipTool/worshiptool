'use client'
import { useApi } from '@/hooks/api/useApi'
import { getPathnameFromUrl, getRouteUrlWithParams } from '@/routes/routes.tech'
import useSubdomainPathnameAlias from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import React, { useEffect } from 'react'

type StableSubdomainLinkProviderProps = {
	children: React.ReactNode
}

export default function StableTeamSubdomainProvider(
	props: StableSubdomainLinkProviderProps
) {
	const { addAliases } = useSubdomainPathnameAlias()

	const { teamGettingApi } = useApi()
	const [apiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			teamGettingApi.teamGettingControllerGetAllSubdomains()
		)
		return result.aliases
	}, [])

	const aliases = apiState.data || []

	useEffect(() => {
		const newAliases = aliases.map((alias) => {
			const url = getRouteUrlWithParams(
				'team',
				{ alias: alias.teamAlias },
				{
					subdomains: false,
				}
			)

			const pathname = getPathnameFromUrl(url)

			return {
				subdomain: alias.subdomain,
				pathname,
			}
		})

		addAliases(newAliases)
	}, [aliases])

	return <>{props.children}</>
}
