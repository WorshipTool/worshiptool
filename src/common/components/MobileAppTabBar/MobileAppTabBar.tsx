'use client'

import { Box, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { alpha } from '@/common/ui/mui'
import useAuth from '@/hooks/auth/useAuth'
import {
	HomeOutlined,
	HomeRounded,
	LibraryMusicOutlined,
	LibraryMusicRounded,
	PersonOutlineRounded,
	PersonRounded,
} from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MOBILE_NAV_BREAKPOINT, MOBILE_NAV_CLEARANCE, isMobileTabBarRoute, mobileTabForPath } from './nav.constants'

const PAGE_MAX_WIDTH = 480

/**
 * The app's mobile bottom navigation — a blue (primary-gradient) tab bar with
 * Home / Songs / Account. Rendered once, globally, next to the top bar (see
 * AppLayoutInner) and driven entirely by the route: it shows on the app-shell
 * routes (where the top bar hides itself) and renders nothing on marketing
 * pages. Phone-only (CSS-hidden on desktop). Like the top bar, it renders an
 * in-flow spacer so page content clears the fixed bar.
 */
export default function MobileAppTabBar() {
	const theme = useTheme()
	const tNav = useTranslations('navigation')
	const { isLoggedIn } = useAuth()
	const pathname = usePathname()

	if (!isMobileTabBarRoute(pathname)) return null

	const active = mobileTabForPath(pathname)
	const loggedIn = isLoggedIn()
	const hideOnDesktop = { [theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' } }

	return (
		<>
			{/* in-flow spacer so content can scroll clear of the fixed bar (mirrors the top bar's spacer) */}
			<Box sx={{ height: MOBILE_NAV_CLEARANCE, flexShrink: 0, ...hideOnDesktop }} />
			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: '100%',
					maxWidth: PAGE_MAX_WIDTH,
					background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
					display: 'flex',
					paddingBottom: 'env(safe-area-inset-bottom)',
					zIndex: 10,
					...hideOnDesktop,
				}}
			>
				<Link to="home" params={{ hledat: undefined }} style={{ flex: 1 }}>
					<TabItem icon={<HomeOutlined />} activeIcon={<HomeRounded />} label={tNav('home')} active={active === 'home'} />
				</Link>
				<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
					<TabItem icon={<LibraryMusicOutlined />} activeIcon={<LibraryMusicRounded />} label={tNav('songs')} active={active === 'songs'} />
				</Link>
				<Link to={loggedIn ? 'account' : 'login'} params={loggedIn ? {} : { previousPage: '', message: '' }} style={{ flex: 1 }}>
					<TabItem icon={<PersonOutlineRounded />} activeIcon={<PersonRounded />} label={tNav('account')} active={active === 'account'} />
				</Link>
			</Box>
		</>
	)
}

type TabItemProps = {
	icon: JSX.Element
	activeIcon?: JSX.Element
	label: string
	active?: boolean
}

// White icon/label on the blue bar, dimmed when inactive.
function TabItem({ icon, activeIcon, label, active }: TabItemProps) {
	const theme = useTheme()
	const color = active ? theme.palette.common.white : alpha(theme.palette.common.white, 0.72)
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, paddingY: 1, color }}>
			{active ? activeIcon ?? icon : icon}
			<Typography small strong={active ? 700 : 400}>
				{label}
			</Typography>
		</Box>
	)
}
