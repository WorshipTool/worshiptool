'use client'
import { RIGHT_SIDE_BAR_CLASSNAME } from '@/common/components/app/SmartPage/SmartPageInner'
import MobileAppTabBar from '@/common/components/MobileAppTabBar/MobileAppTabBar'
import {
	isMobileTabBarRoute,
	MOBILE_NAV_BREAKPOINT,
} from '@/common/components/MobileAppTabBar/nav.constants'
import { Toolbar } from '@/common/components/Toolbar'
import { Box, useTheme } from '@/common/ui'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useSmartMatch } from '../../../../routes/useSmartMatch'
import Footer from '../../Footer/Footer'
import './applayout.styles.css'

interface AppContainerProps {
	children?: React.ReactNode
}

export default function Inner({ children }: AppContainerProps) {
	const hidden = useSmartMatch('playlistCards')
	const theme = useTheme()
	// on the app-shell routes the tab bar replaces the marketing footer on phones
	const appRoute = isMobileTabBarRoute(usePathname())

	return hidden ? (
		children
	) : (
		<Box display={'flex'} flexDirection={'column'} minHeight={'100vh'}>
			<Toolbar />
			<Box className={'app-body-container'}>
				{children}
				<Box className={RIGHT_SIDE_BAR_CLASSNAME}></Box>
			</Box>
			<Box flex={1} />
			<Box sx={appRoute ? { [theme.breakpoints.down(MOBILE_NAV_BREAKPOINT)]: { display: 'none' } } : undefined}>
				<Footer />
			</Box>
			<MobileAppTabBar />
		</Box>
	)
}
