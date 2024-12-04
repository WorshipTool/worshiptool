'use client'
import TeamLoadingScreen from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamLoadingProvider/TeamLoadingScreen'
import { useTeamLogo } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/hooks/useTeamLogo'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import React, { useEffect } from 'react'

type LoadingRoutesProviderProps = {
	children: React.ReactNode
}

export default function TeamLoadingProvider({
	children,
}: LoadingRoutesProviderProps) {
	const { name, apiState } = useInnerTeam()
	const [loading, setLoading] = React.useState(true)
	const { hasLogo, logoUrl, loading: logoLoading } = useTeamLogo()

	const teamFirstLoaded = apiState.data !== undefined

	useEffect(() => {
		if (typeof window === 'undefined') return

		if (!teamFirstLoaded) return
		if (hasLogo && logoLoading) return

		const t = setTimeout(() => {
			setLoading(false)
		}, 1500)

		return () => {
			clearTimeout(t)
		}
	}, [teamFirstLoaded])

	const teamLogoUrl =
		hasLogo && !logoUrl.includes('team-default.webp') ? logoUrl : undefined

	return (
		<div>
			<TeamLoadingScreen
				isVisible={loading || !teamFirstLoaded}
				teamTitle={name}
				teamLogoUrl={teamLogoUrl}
			/>
			{children}
		</div>
	)
}
