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

const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
// how far you scroll before the title finishes shrinking to its compact size
const SHRINK_DISTANCE = 64
const TITLE_MAX = 1.85 // rem
const TITLE_MIN = 1.2 // rem
// hero mode: taller expanded header that collapses to the normal compact bar
const HERO_SHRINK_DISTANCE = 150
const HERO_TITLE = 2.0 // rem — the big title in the expanded hero block
const HERO_MAX = 220 // px — max height of the expanded hero block
// sits above the scrolling content, below the app's overlays/popups (Z_INDEX.OVERLAY = 1300)
const HEADER_Z = 100

type MobileAppHeaderProps<T extends RoutesKeys> = {
	/** The page title — large at rest, shrinks to a compact bar on scroll. */
	title: string
	/**
	 * Generic secondary line under the title. A string gets the default muted
	 * style; pass any node (count, status, chip, meta …) to fully control it.
	 */
	subtitle?: ReactNode
	/**
	 * Hierarchical parent route. When set, an Up (back) control appears inline to
	 * the left of the title and is history-aware (in-app history if present, else
	 * navigate to this parent). Omit on tab-root pages (Domů / Písně / Účet).
	 */
	backTo?: T
	backParams?: SmartAllParams<T>
	/** Up to 2 icon actions shown to the right of the title. Extras are ignored. */
	actions?: ReactNode[]
	/**
	 * When set, the header becomes a taller "hero": at rest it expands to a large
	 * centered block — this cover/emblem node above a big title (+ subtitle) — and
	 * collapses to the normal compact bar (back · title · actions) on scroll. Same
	 * shared header, just taller; omit for the standard header.
	 */
	heroIcon?: ReactNode
	/** Optional control strip (segment / chips) pinned under the header. */
	controlPanel?: ReactNode
	/** Optional panel pinned above the bottom tab bar (e.g. pagination). */
	bottomPanel?: ReactNode
	/** When this value changes, the content scrolls back to the top (e.g. on page change). */
	scrollResetKey?: string | number
	/** Surface (and header) background — palette path. Defaults to the grey app
	 * canvas; a white reading surface (song page) passes 'background.paper'. */
	surface?: string
	/** Header (+ control strip) background — palette path. Defaults to `surface`.
	 * Give a taller hero header a distinct colour (e.g. 'background.paper') from the
	 * grey content area below. */
	headerSurface?: string
	/** When false the scroller has no horizontal padding, so content sits flush
	 * to the edges and manages its own padding (e.g. the song sheet). */
	contentPadded?: boolean
	/**
	 * Render the shell as a fixed overlay (position: fixed) instead of an in-flow
	 * block. Use on pages where the header is nested inside other layout (e.g. the
	 * song page's ContainerGrid) so that nesting can't leak height into the
	 * document and make the whole window scroll. Tab-root pages that render the
	 * header directly don't need this.
	 */
	overlay?: boolean
	/** The page body (the scrolling content below the header). */
	children?: ReactNode
}

/**
 * Native-feeling mobile screen shell with a collapsing large-title header, built
 * as a proper app shell: the header (+ optional control strip) stay pinned at the
 * top, an optional panel + the tab bar stay at the bottom — only the middle
 * content scrolls, so the scrollbar is confined to the content.
 *
 * At rest the header is a single row — back arrow, large title (+ subtitle) and
 * up to two action icons. As the content scrolls the title smoothly shrinks to a
 * compact bar (Material large → small), painted imperatively via refs so the
 * page body never re-renders while scrolling.
 *
 * Renders only on phones (< MOBILE_NAV_BREAKPOINT); hidden on desktop via CSS.
 */
export default function MobileAppHeader<T extends RoutesKeys>({
	title,
	subtitle,
	backTo,
	backParams,
	actions,
	heroIcon,
	controlPanel,
	bottomPanel,
	scrollResetKey,
	surface = 'grey.50',
	headerSurface,
	contentPadded = true,
	overlay = false,
	children,
}: MobileAppHeaderProps<T>) {
	const theme = useTheme()
	const tCommon = useTranslations('common')
	const router = useRouter()
	const navigate = useSmartNavigate()

	const scrollRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLDivElement>(null)
	const titleRef = useRef<HTMLDivElement>(null)
	const subtitleRef = useRef<HTMLDivElement>(null)
	const heroRef = useRef<HTMLDivElement>(null)
	const heroMode = Boolean(heroIcon)
	// header (+ control strip) can differ from the content surface (e.g. a white
	// hero header on the grey app canvas); defaults to the content surface
	const headerBg = headerSurface ?? surface
	// when the header has its own colour, give it a persistent bottom divider so
	// the white header block reads as distinct from the grey content below
	const headerDivider = Boolean(headerSurface)

	// Continuously shrink the title (and fade the subtitle) as the content
	// scrolls — imperative so the list underneath never re-renders while scrolling.
	useEffect(() => {
		const scroller = scrollRef.current
		if (!scroller) return
		let raf = 0
		const paint = () => {
			raf = 0
			const dist = heroMode ? HERO_SHRINK_DISTANCE : SHRINK_DISTANCE
			const p = Math.min(1, Math.max(0, scroller.scrollTop / dist))
			if (heroMode) {
				// collapse the tall hero block away; fade the compact title in
				if (heroRef.current) {
					heroRef.current.style.opacity = String(Math.max(0, 1 - p * 1.6))
					heroRef.current.style.maxHeight = `${(1 - p) * HERO_MAX}px`
				}
				if (titleRef.current) {
					titleRef.current.style.opacity = String(Math.max(0, (p - 0.45) / 0.55))
				}
			} else {
				if (titleRef.current) {
					titleRef.current.style.fontSize = `${TITLE_MAX - (TITLE_MAX - TITLE_MIN) * p}rem`
				}
				if (subtitleRef.current) {
					subtitleRef.current.style.opacity = String(Math.max(0, 1 - p * 1.6))
					subtitleRef.current.style.maxHeight = `${(1 - p) * 24}px`
				}
			}
			if (headerRef.current) {
				// keep the persistent divider when headerDivider; otherwise fade a
				// hairline in as the content scrolls under the header
				if (!headerDivider) {
					headerRef.current.style.borderBottomColor = `rgba(0, 0, 0, ${0.08 * p})`
				}
				headerRef.current.style.boxShadow =
					p > 0.9 ? `0 2px 8px rgba(0, 0, 0, 0.05)` : 'none'
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
	}, [heroMode, headerDivider])

	// scroll back to the top when the reset key changes (e.g. paginator page change)
	useEffect(() => {
		scrollRef.current?.scrollTo({ top: 0 })
	}, [scrollResetKey])

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

	const shownActions = actions?.slice(0, 2) ?? []

	return (
		<Box
			sx={{
				// app-shell surface that fills the viewport down to the tab bar;
				// header + panels stay pinned, only the content region scrolls
				...(overlay
					? {
							// fixed overlay: removed from document flow, so no parent
							// nesting can leak height into the page and scroll the window
							position: 'fixed',
							top: 0,
							left: 0,
							right: 0,
							bottom: MOBILE_NAV_CLEARANCE,
							zIndex: 2,
						}
					: {
							// in-flow full-bleed block (tab-root pages rendered directly)
							position: 'relative',
							width: '100vw',
							marginLeft: 'calc(50% - 50vw)',
							marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
							height: `calc(100dvh - ${MOBILE_NAV_CLEARANCE})`,
						}),
				bgcolor: surface,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
			}}
		>
			{/* header — a compact row (back · title · actions). In hero mode a taller
			    expanded block (cover + big title + subtitle) sits below it. The title
			    shrinks / the hero collapses on scroll (see effect above). */}
			<Box
				ref={headerRef}
				sx={{
					flexShrink: 0,
					zIndex: HEADER_Z,
					display: 'flex',
					flexDirection: 'column',
					paddingTop: `calc(${TOOLBAR_SPACER} + 12px)`,
					paddingBottom: 1,
					bgcolor: headerBg,
					borderBottom: '1px solid',
					borderColor: headerDivider ? 'grey.200' : 'transparent',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, paddingX: 1.5 }}>
					{backTo && (
						<IconButton
							onClick={goUp}
							alt={tCommon('back')}
							color="grey.800"
							sx={{ marginLeft: -0.5, flexShrink: 0 }}
						>
							<ArrowBackRounded />
						</IconButton>
					)}
					<Box
						sx={{
							flex: 1,
							minWidth: 0,
							// keep the header the same height on every page: match the
							// back-arrow / action buttons (40px) even when the title is the
							// only thing in the row, so a title-only header (Seznam, Účet)
							// doesn't collapse shorter than pages that have controls
							minHeight: 40,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							paddingLeft: backTo ? 0 : 0.5,
						}}
					>
						<Box
							ref={titleRef}
							// hero mode: this is the compact title, hidden at rest and faded
							// in on scroll (the big title lives in the hero block below)
							style={heroMode ? { opacity: 0 } : undefined}
							sx={{
								fontSize: `${heroMode ? TITLE_MIN : TITLE_MAX}rem`,
								fontWeight: 800,
								letterSpacing: '-0.4px',
								lineHeight: 1.15,
								color: 'grey.900',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{title}
						</Box>
						{subtitle && !heroMode && (
							<Box ref={subtitleRef} sx={{ overflow: 'hidden', marginTop: 0.25 }}>
								{typeof subtitle === 'string' ? (
									<Typography small strong={500} color="grey.600">
										{subtitle}
									</Typography>
								) : (
									subtitle
								)}
							</Box>
						)}
					</Box>
					{shownActions.length > 0 && (
						<Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
							{shownActions.map((a, i) => (
								<Box key={i} sx={{ display: 'flex' }}>
									{a}
								</Box>
							))}
						</Box>
					)}
				</Box>

				{/* hero mode: taller expanded block, collapses to the row on scroll */}
				{heroMode && (
					<Box
						ref={heroRef}
						sx={{
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							paddingX: 2.5,
							paddingTop: 0.5,
						}}
					>
						{heroIcon}
						<Box
							sx={{
								fontSize: `${HERO_TITLE}rem`,
								fontWeight: 800,
								letterSpacing: '-0.5px',
								lineHeight: 1.15,
								color: 'grey.900',
								marginTop: 1,
							}}
						>
							{title}
						</Box>
						{subtitle && (
							<Box sx={{ marginTop: 0.5 }}>
								{typeof subtitle === 'string' ? (
									<Typography small strong={500} color="grey.600">
										{subtitle}
									</Typography>
								) : (
									subtitle
								)}
							</Box>
						)}
					</Box>
				)}

				{/* control strip — inside the header block so it shares the header
				    background (one solid white zone above the bottom divider) */}
				{controlPanel && (
					<Box sx={{ paddingX: 2, paddingTop: 1 }}>{controlPanel}</Box>
				)}
			</Box>

			{/* the only scroller — scrollbar confined between the header/panels */}
			<Box
				ref={scrollRef}
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: 'auto',
					overflowX: 'hidden',
					paddingX: contentPadded ? 2 : 0,
					paddingTop: 0.5,
					paddingBottom: 2,
				}}
			>
				{children}
			</Box>

			{/* optional panel pinned above the bottom tab bar (e.g. pagination).
			    Must stay BELOW the tab bar so its raised center action (the
			    "Hledat" button that pokes up over the bar) renders in front. */}
			{bottomPanel && (
				<Box
					sx={{
						flexShrink: 0,
						zIndex: 1,
						bgcolor: 'background.paper',
						borderTop: '1px solid',
						borderColor: 'grey.200',
						boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
						display: 'flex',
						justifyContent: 'center',
						paddingY: 0.5,
					}}
				>
					{bottomPanel}
				</Box>
			)}
		</Box>
	)
}
