'use client'

import {
	MOBILE_NAV_BREAKPOINT,
	MOBILE_NAV_CLEARANCE,
} from '@/common/components/MobileAppTabBar/nav.constants'
import { Box, IconButton, Typography, useTheme } from '@/common/ui'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { ArrowBackRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

// height of the compact bar's content row (safe-area is added on top of this)
const BAR_ROW = 52
// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset; reclaim exactly that so the grey canvas reaches the very top
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
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
 * Native-feeling mobile screen shell with a collapsing large-title header, built
 * as a proper app shell: the surface fills the viewport (minus the bottom tab
 * bar) and does NOT scroll itself — only the middle content region scrolls, so
 * the scrollbar is confined to the content, not running the full height behind
 * the header and tab bar. The compact bar continuously fades in as the content
 * scrolls (background, hairline, centered title tied to scroll position), and
 * the large title scrolls away underneath. Painting is imperative (refs) so the
 * page body never re-renders while scrolling.
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
	const scrollRef = useRef<HTMLDivElement>(null)

	// Continuously map the content scroller's position → collapse progress (0…1)
	// over the height of the large title block, and paint the bar imperatively
	// (no re-render, so a long list underneath never re-renders while scrolling).
	useEffect(() => {
		const scroller = scrollRef.current
		if (!scroller) return
		let raf = 0
		const paint = () => {
			raf = 0
			const distance = Math.max(1, (largeRef.current?.offsetHeight ?? 64) - 4)
			const p = Math.min(1, Math.max(0, scroller.scrollTop / distance))
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
		scroller.addEventListener('scroll', onScroll, { passive: true })
		paint()
		return () => {
			scroller.removeEventListener('scroll', onScroll)
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
				// full-bleed app-shell surface that fills the viewport down to the
				// tab bar; it doesn't scroll — only the inner content region does
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				height: `calc(100dvh - ${MOBILE_NAV_CLEARANCE})`,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
			}}
		>
			{/* compact bar (fixed height) — its background/hairline and centered
			    title fade in continuously with scroll (see effect above) */}
			<Box
				ref={barRef}
				sx={{
					flexShrink: 0,
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

			{/* the ONLY scroller — scrollbar is confined between the header and the
			    tab bar, not the full viewport height */}
			<Box
				ref={scrollRef}
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: 'auto',
					overflowX: 'hidden',
					paddingBottom: 2,
				}}
			>
				{/* large title — scrolls away under the bar */}
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
				<Box sx={{ paddingX: 2 }}>{children}</Box>
			</Box>
		</Box>
	)
}
