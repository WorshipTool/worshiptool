'use client'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import { routesPaths } from '@/routes'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import useAuth from '../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../routes/useSmartNavigate'
import BasicInfo from './components/BasicInfo'
import TabsPanel from './components/TabsPanel'

export default SmartPage(Account)
function Account() {
	const { isLoggedIn } = useAuth()

	const navigate = useSmartNavigate()

	const t = useTranslations('auth.login')
	const tNav = useTranslations('navigation')

	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down(MOBILE_NAV_BREAKPOINT))

	useEffect(() => {
		if (!isLoggedIn()) {
			navigate('login', {
				previousPage: routesPaths.account,
				message: 'Pro zobrazeni účtu se musíte přihlásit.',
			})
		}
	}, [isLoggedIn()])

	// phones get the native app shell (Účet is a tab-root, so no back arrow)
	if (phoneVersion) {
		return (
			<MobileAppHeader title={tNav('account')}>
				<BasicInfo />
			</MobileAppHeader>
		)
	}

	return (
		<Box sx={{ padding: 8 }}>
			<TabsPanel />
		</Box>
	)
}
