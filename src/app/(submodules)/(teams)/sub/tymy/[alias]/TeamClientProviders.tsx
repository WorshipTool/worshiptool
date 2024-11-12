'use client'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import OutsideLinkBlocker from '@/common/ui/Link/OutsideLinkBlocker'
import { routesPaths, SmartAllParams } from '@/routes'
import { urlMatchPatterns } from '@/routes/routes.tech'
import React from 'react'

type Props = {
	children: React.ReactNode
}
export default function TeamClientProviders(props: Props) {
	const { alias } = useInnerTeam()
	return (
		<>
			<OutsideLinkBlocker
				condition={({ url, params: p }) => {
					const isTeam = urlMatchPatterns(url, routesPaths.team, true)

					// Block everything outside the team
					if (!isTeam) return true

					const params: SmartAllParams<'team'> = p
					const teamAlias = params.alias

					if (teamAlias !== alias) return true

					return false
				}}
				popupTitle="Opouštíte prostředí týmu"
				popupMessage="Link vede mimo tým, který máte otevřený. Opravdu chcete pokračovat?"
			>
				{props.children}
			</OutsideLinkBlocker>
		</>
	)
}
