'use client'

import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { Box, Button, Typography, useTheme } from '@/common/ui'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { ChevronLeftRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'

// Height of the collapsed bar's content row (safe-area is added on top of this).
const BAR_ROW = 52
// Full-bleed helpers, mirroring the other mobile surfaces (SeznamMobile etc.):
// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset, so reclaim exactly that to let the grey canvas reach the very top.
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
// clearance so the last rows clear the bottom tab bar + its raised center action
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 150px)'
// sits above the scrolling content, below the app's overlays/popups (Z_INDEX.OVERLAY = 1300)
const HEADER_Z = 100

type MobileAppHeaderProps<T extends RoutesKeys> = {
	/** The page title — shown large at rest, small & centered once collapsed. */
	title: string
	/** Optional secondary line under the title (e.g. an already-formatted count). */
	subtitle?: string
	/**
	 * Hierarchical parent route. When set, an Up (back) control appears and is
	 * history-aware: it uses in-app history when we arrived from within the app,
	 * otherwise it navigates to this parent (so deep-links don't leave the app).
	 * Omit on tab-root pages (Domů / Písně / Účet) to hide the back control.
	 */
	backTo?: T
	backParams?: SmartAllParams<T>
	/** Trailing action(s): an IconButton, a Button pill, … Page-specific. */
	action?: ReactNode
	/** The page body (the scrolling content below the header). */
	children?: ReactNode
}

/**
 * Native-feeling mobile screen shell with a collapsing iOS-style large-title
 * header. At rest the title is large on the grey canvas; as the content scrolls
 * up, the title slides under a slim sticky bar that fades in a centered compact
 * title + hairline (Apple / Material "large → small" pattern).
 *
 * Renders only on phones (< MOBILE_NAV_BREAKPOINT); hidden on desktop via CSS so
 * the desktop layout is untouched. Owns the full-bleed grey surface so the
 * sticky bar sticks across the whole page scroll.
 */
export default function MobileAppHeader<T extends RoutesKeys>({
	title,
	subtitle,
	backTo,
	backParams,
	action,
	children,
}: MobileAppHeaderProps<T>) {
	const theme = useTheme()
	const tCommon = useTranslations('common')
	const router = useRouter()
	const navigate = useSmartNavigate()

	const barRef = useRef<HTMLDivElement>(null)
	const sentinelRef = useRef<HTMLDivElement>(null)
	const [collapsed, setCollapsed] = useState(false)

	// Collapse once the large title has scrolled under the bar. The trigger line
	// is the *measured* bar height (incl. safe-area), so it stays accurate on any
	// device without hard-coding the notch inset.
	useEffect(() => {
		const sentinel = sentinelRef.current
		const bar = barRef.current
		if (!sentinel || !bar) return

		let observer: IntersectionObserver | null = null
		const attach = () => {
			observer?.disconnect()
			const h = Math.round(bar.getBoundingClientRect().height)
			observer = new IntersectionObserver(
				([entry]) => setCollapsed(!entry.isIntersecting),
				{ rootMargin: `-${h}px 0px 0px 0px`, threshold: 0 }
			)
			observer.observe(sentinel)
		}
		attach()
		window.addEventListener('resize', attach)
		return () => {
			observer?.disconnect()
			window.removeEventListener('resize', attach)
		}
	}, [])

	const goUp = () => {
		if (!backTo) return
		const idx = (
			typeof window !== 'undefined' ? window.history.state?.idx : undefined
		) as number | undefined
		const cameFromInApp =
			typeof idx === 'number'
				? idx > 0
				: typeof window !== 'undefined' && window.history.length > 1
		if (cameFromInApp) router.back()
		else navigate(backTo, (backParams ?? {}) as SmartAllParams<T>)
	}

	const backControl = backTo ? (
		<Button
			variant="text"
			color="primary"
			onClick={goUp}
			alt={tCommon('back')}
			disableUppercase
			sx={{ minWidth: 44, minHeight: 44, paddingX: 0.5 }}
		>
			<ChevronLeftRounded sx={{ fontSize: 28 }} />
			{!collapsed && (
				<Box component="span" sx={{ marginLeft: -0.25, fontWeight: 400 }}>
					{tCommon('back')}
				</Box>
			)}
		</Button>
	) : (
		<Box sx={{ minWidth: 44 }} />
	)

	return (
		<Box
			sx={{
				// full-bleed grey canvas; hidden on desktop so desktop stays untouched
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.50',
				[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
			}}
		>
			{/* slim bar fixed to the viewport top — transparent at rest, fills in
			    once collapsed. Fixed (not sticky) because the app's global
			    overflow-x guard on <html> breaks position:sticky here, whereas
			    fixed is reliable (same as the bottom tab bar). */}
			<Box
				ref={barRef}
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: HEADER_Z,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					paddingX: 1,
					paddingTop: `calc(${TOOLBAR_SPACER} + 4px)`,
					minHeight: BAR_ROW,
					bgcolor: collapsed ? 'background.paper' : 'transparent',
					borderBottom: '1px solid',
					borderColor: collapsed ? 'grey.200' : 'transparent',
					boxShadow: collapsed ? '0 1px 6px rgba(0,0,0,0.06)' : 'none',
					transition:
						'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
				}}
			>
				{backControl}
				<Box sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
					<Typography
						strong={600}
						sx={{
							opacity: collapsed ? 1 : 0,
							transition: 'opacity 0.2s ease',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{title}
					</Typography>
				</Box>
				<Box
					sx={{
						minWidth: 44,
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					{collapsed ? action : null}
				</Box>
			</Box>

			{/* in-flow spacer reserving the fixed bar's height so the large title
			    starts just below it */}
			<Box sx={{ height: `calc(${TOOLBAR_SPACER} + 56px)` }} />

			{/* large title row — scrolls away under the bar */}
			<Box
				sx={{
					paddingX: 2.5,
					paddingBottom: 1.5,
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'space-between',
					gap: 1,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h4" strong={800} sx={{ lineHeight: 1.15 }}>
						{title}
					</Typography>
					{subtitle && (
						<Typography small strong={500} color="grey.600">
							{subtitle}
						</Typography>
					)}
				</Box>
				{action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
			</Box>

			{/* trigger line for the collapse observer */}
			<Box ref={sentinelRef} sx={{ height: '1px' }} />

			{/* page body */}
			<Box
				sx={{
					paddingX: 2,
					paddingTop: 1,
					paddingBottom: CONTENT_CLEARANCE,
				}}
			>
				{children}
			</Box>
		</Box>
	)
}
