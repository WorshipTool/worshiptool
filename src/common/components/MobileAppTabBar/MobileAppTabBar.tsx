'use client'

import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import MobileToolsMenu from '@/common/components/MobileAppTabBar/MobileToolsMenu'
import { Box, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import useAuth from '@/hooks/auth/useAuth'
import {
	Apps,
	AppsOutlined,
	HomeOutlined,
	HomeRounded,
	InfoOutlined,
	InfoRounded,
	LibraryMusicOutlined,
	LibraryMusicRounded,
	LoginRounded,
	PersonOutlineRounded,
	PersonRounded,
	Search,
} from '@mui/icons-material'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { useMobileSearchOpen } from './mobileSearchState'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
	ABOVE_TABBAR_SLOT_ID,
	MOBILE_NAV_BREAKPOINT,
	MOBILE_NAV_CLEARANCE,
	isMobileTabBarRoute,
	mobileTabForPath,
	pageOwnsBottomClearance,
} from './nav.constants'

/**
 * The app's mobile bottom navigation — a light (white) tab bar of equally sized
 * tabs: Domů / Písně / Hledat / Nástroje (or O aplikaci) / Účet (or Přihlásit).
 * Search is the app's preferred action and is marked by tint, not by size, so
 * the row stays even and it can still show an active state. Rendered once,
 * globally, next to the top
 * bar (see AppLayoutInner) and driven by the route: it shows on the app-shell
 * routes (where the top bar hides itself) and renders nothing on marketing
 * pages. Phone-only (CSS-hidden on desktop). Like the top bar, it renders an
 * in-flow spacer so page content clears the fixed bar.
 */
export default function MobileAppTabBar() {
	const theme = useTheme()
	const tNav = useTranslations('navigation')
	const { isLoggedIn } = useAuth()
	const pathname = useClientPathname()
	const searchActive = useMobileSearchOpen()

	const [toolsOpen, setToolsOpen] = useState(false)

	if (!isMobileTabBarRoute(pathname)) return null

	const active = mobileTabForPath(pathname)
	const loggedIn = isLoggedIn()
	const hideOnDesktop = {
		[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
	}

	return (
		<>
			{/* in-flow spacer so content can scroll clear of the fixed bar — skipped
			    on pages whose surface already pads for the bar itself */}
			{!pageOwnsBottomClearance(pathname) && (
				<Box sx={{ height: MOBILE_NAV_CLEARANCE, flexShrink: 0, ...hideOnDesktop }} />
			)}
			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					zIndex: 10,
					...hideOnDesktop,
				}}
			>
				{/* pages portal their bottom-docked content here; it stacks directly
				    on top of the bar via layout (no hard-coded bar height) */}
				<Box
					id={ABOVE_TABBAR_SLOT_ID}
					sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
				/>

				<Box
					sx={{
						bgcolor: 'background.paper',
						borderTop: '1px solid',
						borderColor: 'grey.200',
						display: 'flex',
						alignItems: 'flex-start',
						paddingTop: 1.5,
						paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
						width: '100%',
					}}
				>
					<Link to="home" params={{ hledat: undefined }} style={{ flex: 1, minWidth: 0 }}>
					<TabItem
						icon={<HomeOutlined />}
						activeIcon={<HomeRounded />}
						label={tNav('home')}
						active={active === 'home' && !searchActive}
					/>
				</Link>
				<Link to="songsList" params={{ s: undefined }} style={{ flex: 1, minWidth: 0 }}>
					<TabItem
						icon={<LibraryMusicOutlined />}
						activeIcon={<LibraryMusicRounded />}
						label={tNav('songs')}
						active={active === 'songs'}
					/>
				</Link>

				{/* the app's preferred action, emphasised by style rather than size
				    (house Link doesn't forward onClick, so the search-focus event is
				    dispatched from a wrapper) */}
				<Link to="home" params={{ hledat: '' }} style={{ flex: 1, minWidth: 0 }}>
					<Box
						onClick={() =>
							window.dispatchEvent(new Event(MAIN_SEARCH_EVENT_NAME))
						}
					>
						<TabItem
							icon={<Search />}
							label={tNav('search')}
							active={searchActive}
							emphasized
						/>
					</Box>
				</Link>

				{/* logged in: Nástroje + Účet; logged out: O aplikaci + Přihlásit se */}
				{loggedIn ? (
						<Box
							component="button"
							type="button"
							onClick={() => setToolsOpen(true)}
							sx={{
								flex: 1,
								minWidth: 0,
								border: 'none',
								background: 'transparent',
								padding: 0,
								cursor: 'pointer',
								font: 'inherit',
							}}
						>
							<TabItem
								icon={<AppsOutlined />}
								activeIcon={<Apps />}
								label={tNav('tools')}
								active={toolsOpen}
							/>
						</Box>
					) : (
						<Link to="about" params={{}} style={{ flex: 1, minWidth: 0 }}>
							<TabItem
								icon={<InfoOutlined />}
								activeIcon={<InfoRounded />}
								label={tNav('about')}
							/>
						</Link>
					)}

					{loggedIn ? (
						<Link to="account" params={{}} style={{ flex: 1, minWidth: 0 }}>
							<TabItem
								icon={<PersonOutlineRounded />}
								activeIcon={<PersonRounded />}
								label={tNav('account')}
								active={active === 'account'}
							/>
						</Link>
					) : (
						<Link
							to="login"
							params={{ previousPage: '', message: '' }}
							style={{ flex: 1, minWidth: 0 }}
						>
							<TabItem
								icon={<LoginRounded />}
								label={tNav('login')}
								active={active === 'account'}
							/>
						</Link>
					)}
				</Box>
			</Box>

			{/* lazy-mounted so its data hooks only run when the sheet is opened */}
			{toolsOpen && <MobileToolsMenu onClose={() => setToolsOpen(false)} />}
		</>
	)
}

type TabItemProps = {
	icon: JSX.Element
	activeIcon?: JSX.Element
	label: string
	active?: boolean
	/**
	 * Marks the app's preferred action (search). Tinted rather than enlarged:
	 * every tab keeps the same footprint, so the bar doesn't get squeezed to make
	 * room for one item, and the emphasised tab can still show an active state —
	 * which a permanently-highlighted raised button cannot.
	 */
	emphasized?: boolean
}

// side tab: blue (brand) when active, grey when not; filled icon + bold label when active
export function TabItem({ icon, activeIcon, label, active, emphasized }: TabItemProps) {
	const iconColor = emphasized
		? active
			? 'common.white'
			: 'primary.main'
		: active
			? 'primary.main'
			: 'grey.500'
	const labelColor = active || emphasized ? 'primary.main' : 'grey.700'
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 0.6,
				minWidth: 0,
			}}
		>
			{/* every tab carries the same pill geometry so the row stays even; only
			    the emphasised one paints it in */}
			<Box
				sx={{
					color: iconColor,
					display: 'flex',
					paddingX: 1.5,
					paddingY: 0.25,
					borderRadius: 999,
					bgcolor: emphasized && active ? 'primary.main' : 'transparent',
					transition: 'background-color 0.15s ease',
					'& svg': { fontSize: 25 },
				}}
			>
				{active ? activeIcon ?? icon : icon}
			</Box>
			<Typography
				noWrap
				size="0.65rem"
				strong={active || emphasized ? 700 : 500}
				color={labelColor}
				sx={{ lineHeight: 1.2 }}
			>
				{label}
			</Typography>
		</Box>
	)
}
