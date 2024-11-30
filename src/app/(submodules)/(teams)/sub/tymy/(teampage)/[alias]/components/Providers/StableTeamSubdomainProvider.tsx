'use client'
import { useApi } from '@/hooks/api/useApi'
import { getRouteUrlWithParams } from '@/routes/routes.tech'
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
