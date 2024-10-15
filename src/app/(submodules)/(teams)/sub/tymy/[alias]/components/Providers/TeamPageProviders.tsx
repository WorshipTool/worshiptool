'use client'
import { TeamSideBarProvider } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import React from 'react'

type SmartTeamPageProvidersProps = {
	children: React.ReactNode
}

export default function TeamPageProviders(props: SmartTeamPageProvidersProps) {
	return <TeamSideBarProvider>{props.children}</TeamSideBarProvider>
}
