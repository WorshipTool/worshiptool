'use client'
import { TeamSideBarProvider } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import { TeamTopBarProvider } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/hooks/useTeamTopBar'
import React from 'react'

type SmartTeamPageProvidersProps = {
	children: React.ReactNode
}

export default function TeamPageProviders(props: SmartTeamPageProvidersProps) {
	return (
		<TeamSideBarProvider>
			<TeamTopBarProvider>{props.children}</TeamTopBarProvider>
		</TeamSideBarProvider>
	)
}
