'use client'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box } from '@mui/material'
import React, { useEffect, useMemo } from 'react'

export type SmartPageOptions = {
	transparentToolbar: boolean
	whiteToolbarVersion: boolean
	hideMiddleNavigation: boolean
	hideTitle: boolean
	hideFooter: boolean
	hideToolbar: boolean
	fullWidth: boolean
	hidePadding: boolean
}

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
			whiteToolbarVersion: false,
			hideMiddleNavigation: false,
			hideTitle: false,
			hideFooter: false,
			hideToolbar: false,
			fullWidth: false,
			hidePadding: false,
			...pageOptions,
		}),
		[pageOptions]
	)

	const toolbar = useToolbar()
	const footer = useFooter()

	useEffect(() => {
		toolbar.setTransparent(options.transparentToolbar)
		toolbar.setWhiteVersion(options.whiteToolbarVersion)
		toolbar.setHideMiddleNavigation(options.hideMiddleNavigation)
		toolbar.setShowTitle(!options.hideTitle)
		toolbar.setHidden(options.hideToolbar)
		footer.setShow(!options.hideFooter)
	}, [options])

	return (
		<Box
			sx={{
				...(options.fullWidth
					? {
							flex: 1,
					  }
					: {
							width: options.hidePadding
								? 'min(100%, 1320px)'
								: 'min(calc(100% - 4*8*2px), 1320px)',
					  }),
			}}
		>
			{children}
		</Box>
	)
}
