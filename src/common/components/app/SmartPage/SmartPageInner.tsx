'use client'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import MobileAppTabBar, {
	MOBILE_NAV_BREAKPOINT,
	MOBILE_NAV_CLEARANCE,
} from '@/common/components/MobileAppTabBar/MobileAppTabBar'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import React, { useEffect, useMemo } from 'react'

// type of dict or null for every option
type Nullable<T> = {
	[P in keyof T]: T[P] | null
}

export type SmartPageOptions = Nullable<{
	transparentToolbar: boolean
	darkToolbar: boolean
	whiteToolbarVersion: boolean
	hideMiddleNavigation: boolean
	hideTitle: boolean
	hideFooter: boolean
	hideToolbar: boolean
	fullWidth: boolean
	hidePadding: boolean
	middleWidth: boolean
	topPadding: boolean
	containLayout: boolean
	/** App page: hide the top bar on mobile and show the bottom tab bar instead */
	mobileTabBar: boolean
}>

const MIDDLE_WIDTH = 900

export const RIGHT_SIDE_BAR_CLASSNAME = 'right-side-bar'
export const SmartPageInnerProvider = ({
	children,
	pageOptions,
}: {
	children: React.ReactNode
	pageOptions?: Partial<SmartPageOptions>
}) => {
	const options: SmartPageOptions = useMemo(
		() => ({
			transparentToolbar: false,
			darkToolbar: false,
			whiteToolbarVersion: false,
			hideMiddleNavigation: false,
			hideTitle: false,
			hideFooter: false,
			hideToolbar: false,
			fullWidth: false,
			hidePadding: false,
			middleWidth: false,
			topPadding: false,
			containLayout: false,
			mobileTabBar: false,
			...pageOptions,
		}),
		[pageOptions]
	)

	const toolbar = useToolbar()
	const footer = useFooter()
	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down(MOBILE_NAV_BREAKPOINT))

	useEffect(() => {
		if (options.transparentToolbar !== null)
			toolbar.setTransparent(options.transparentToolbar)

		if (options.darkToolbar !== null) toolbar.setDark(options.darkToolbar)

		if (options.whiteToolbarVersion !== null)
			toolbar.setWhiteVersion(options.whiteToolbarVersion)

		if (options.hideMiddleNavigation !== null)
			toolbar.setHideMiddleNavigation(options.hideMiddleNavigation)

		if (options.hideTitle !== null) toolbar.setShowTitle(!options.hideTitle)

		if (options.hideToolbar !== null) toolbar.setHidden(options.hideToolbar)

		if (options.hideFooter !== null) footer.setShow(!options.hideFooter)
	}, [options])

	// App pages replace the top bar with the bottom tab bar on phones. Kept in a
	// separate effect (runs after the options one) so it wins the setHidden race,
	// and restored on leave so other pages get their top bar back.
	useEffect(() => {
		if (!options.mobileTabBar) return
		toolbar.setHidden(phoneVersion)
		return () => toolbar.setHidden(false)
	}, [options.mobileTabBar, phoneVersion])

	return (
		<Box
			sx={{
				...(options.fullWidth
					? {
							flex: 1,
					  }
					: {
							maxWidth: options.middleWidth ? MIDDLE_WIDTH : undefined,
							width: options.hidePadding
								? 'min(100%, 1320px)'
								: 'min(calc(100% - 4*8*2px), 1320px)',
							// if small remove hidePadding
							[theme.breakpoints.down('sm')]: {
								width: 'calc(100% - 1*8*2px)',
							},
					  }),

				...(options.topPadding
					? {
							paddingTop: 7,
					  }
					: {}),

				...(options.containLayout
					? {
							contain: 'layout',
					  }
					: {}),

				// clear the fixed bottom tab bar on phones
				...(options.mobileTabBar
					? {
							[theme.breakpoints.down(MOBILE_NAV_BREAKPOINT)]: {
								paddingBottom: MOBILE_NAV_CLEARANCE,
							},
					  }
					: {}),
			}}
		>
			{children}
			{options.mobileTabBar && <MobileAppTabBar />}
		</Box>
	)
}
