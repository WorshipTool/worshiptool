'use client'
import { useTeamSideBar } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import { useTeamTopBar } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamTopBar'
import { Box } from '@/common/ui'
import { SxProps } from '@/common/ui/mui'
import React, { useEffect, useMemo } from 'react'

// type of dict or null for every option
type Nullable<T> = {
	[P in keyof T]: T[P] | null
}

export type SmartTeamPageOptions = Nullable<{
	hidePadding: boolean
	collapseSideBar: boolean
	fixedTopBar: boolean
	topBarSx: SxProps
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
			fixedTopBar: false,
			topBarSx: {},
			...pageOptions,
		}),
		[pageOptions]
	)

	const sidebar = useTeamSideBar()
	const topbar = useTeamTopBar()

	useEffect(() => {
		if (options.collapseSideBar !== null)
			sidebar.setCollapsedAuto(options.collapseSideBar)

		if (options.fixedTopBar !== null) topbar.setFixed(options.fixedTopBar)

		if (options.topBarSx !== null) topbar.setSx(options.topBarSx)
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
