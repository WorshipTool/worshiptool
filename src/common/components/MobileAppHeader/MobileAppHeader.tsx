'use client'

import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { Box, IconButton, Typography, useTheme } from '@/common/ui'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { ArrowBackRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

// height of the compact bar's content row (safe-area is added on top of this)
const BAR_ROW = 52
// full-bleed helpers, mirroring the other mobile surfaces (SeznamMobile etc.)
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
 * Native-feeling mobile screen shell with a collapsing large-title header. At
 * rest the title is large on the grey canvas with the back/action controls
 * floating above it; as the content scrolls up, the compact bar *continuously*
 * fades in (background, hairline and a centered compact title tied to the scroll
 * position — not a snap) while the large title slides away underneath.
 *
 * The bar is `position: fixed` (the app's global overflow-x guard on <html>
 * breaks position:sticky) — reliable, same as the bottom tab bar. The scroll
 * animation is driven imperatively via refs so the page body never re-renders.
 *
 * Renders only on phones (< MOBILE_NAV_BREAKPOINT); hidden on desktop via CSS.
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
	const compactTitleRef = useRef<HTMLDivElement>(null)
	const largeRef = useRef<HTMLDivElement>(null)

	// Continuously map scroll position → collapse progress (0…1) over the height
	// of the large title block, and paint the bar imperatively (no re-render, so
	// a long list underneath never re-renders while scrolling).
	useEffect(() => {
		let raf = 0
		const paint = () => {
			raf = 0
			const distance = Math.max(1, (largeRef.current?.offsetHeight ?? 64) - 4)
			const p = Math.min(1, Math.max(0, window.scrollY / distance))
			const bar = barRef.current
			if (bar) {
				bar.style.backgroundColor = `rgba(255, 255, 255, ${p})`
				bar.style.borderBottomColor = `rgba(0, 0, 0, ${0.08 * p})`
				bar.style.boxShadow =
					p > 0.01 ? `0 2px 8px rgba(0, 0, 0, ${0.05 * p})` : 'none'
			}
			const ct = compactTitleRef.current
			if (ct) {
				ct.style.opacity = String(p)
				ct.style.transform = `translateY(${(1 - p) * 8}px)`
			}
		}
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(paint)
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		paint()
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (raf) cancelAnimationFrame(raf)
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
			{/* compact bar fixed to the viewport top — its background/hairline and
			    centered title fade in continuously with scroll (see effect above) */}
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
					gap: 0.5,
					paddingX: 0.5,
					paddingTop: `calc(${TOOLBAR_SPACER} + 4px)`,
					minHeight: BAR_ROW,
					backgroundColor: 'transparent',
					borderBottom: '1px solid transparent',
				}}
			>
				{backTo ? (
					<IconButton onClick={goUp} alt={tCommon('back')} color="grey.800">
						<ArrowBackRounded />
					</IconButton>
				) : (
					<Box sx={{ minWidth: 44 }} />
				)}
				<Box
					ref={compactTitleRef}
					sx={{
						flex: 1,
						minWidth: 0,
						textAlign: 'center',
						opacity: 0,
						paddingX: 0.5,
					}}
				>
					<Typography
						strong={600}
						sx={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{title}
					</Typography>
				</Box>
				<Box
					sx={{ minWidth: 44, display: 'flex', justifyContent: 'flex-end' }}
				>
					{action}
				</Box>
			</Box>

			{/* in-flow spacer reserving the fixed bar's height so the large title
			    starts just below it */}
			<Box sx={{ height: `calc(${TOOLBAR_SPACER} + 56px)` }} />

			{/* large title — floats under the controls and scrolls away */}
			<Box ref={largeRef} sx={{ paddingX: 2.5, paddingBottom: 1.5 }}>
				<Typography variant="h4" strong={800} sx={{ lineHeight: 1.15 }}>
					{title}
				</Typography>
				{subtitle && (
					<Typography small strong={500} color="grey.600">
						{subtitle}
					</Typography>
				)}
			</Box>

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
