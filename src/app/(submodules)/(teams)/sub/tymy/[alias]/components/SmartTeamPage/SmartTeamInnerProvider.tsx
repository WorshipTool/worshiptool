'use client'
import { useTeamSideBar } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import { Box } from '@mui/material'
import React, { useEffect, useMemo } from 'react'

// type of dict or null for every option
type Nullable<T> = {
	[P in keyof T]: T[P] | null
}

export type SmartTeamPageOptions = Nullable<{
	hidePadding: boolean
	collapseSideBar: boolean
}>

export const SmartTeamPageInnerProvider = ({
	children,
	pageOptions,
}: {
	children: React.ReactNode
	pageOptions?: Partial<SmartTeamPageOptions>
}) => {
	const options: SmartTeamPageOptions = useMemo(
		() => ({
			hidePadding: false,
			collapseSideBar: false,
			...pageOptions,
		}),
		[pageOptions]
	)

	const sidebar = useTeamSideBar()

	useEffect(() => {
		if (options.collapseSideBar !== null)
			sidebar.setCollapsedAuto(options.collapseSideBar)
	}, [options])
	// const theme = useTheme()

	return (
		<Box
			sx={{
				padding: options.hidePadding ? 0 : 4,
				// if small remove hidePadding
				// [theme.breakpoints.down('sm')]: {
				// 	width: 'calc(100% - 1*8*2px)',
				// },
			}}
		>
			{children}
		</Box>
	)
}
