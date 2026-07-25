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
	/** Optional control strip (segment / chips) pinned under the header. */
	controlPanel?: ReactNode
	/** Optional panel pinned above the bottom tab bar (e.g. pagination). */
	bottomPanel?: ReactNode
	/** When this value changes, the content scrolls back to the top (e.g. on page change). */
	scrollResetKey?: string | number
	/** Surface (and header) background — palette path. Defaults to the grey app
	 * canvas; a white reading surface (song page) passes 'background.paper'. */
	surface?: string
	/** Persistent hairline under the header. Off by default, in which case a
	 * hairline fades in as content scrolls beneath the header instead. */
	divider?: boolean
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
	controlPanel,
	bottomPanel,
	scrollResetKey,
	surface = 'grey.50',
	divider = false,
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

	// Continuously shrink the title (and fade the subtitle) as the content
	// scrolls — imperative so the list underneath never re-renders while scrolling.
	useEffect(() => {
		const scroller = scrollRef.current
		if (!scroller) return
		let raf = 0
		const paint = () => {
			raf = 0
			const p = Math.min(1, Math.max(0, scroller.scrollTop / SHRINK_DISTANCE))
			if (titleRef.current) {
				titleRef.current.style.fontSize = `${TITLE_MAX - (TITLE_MAX - TITLE_MIN) * p}rem`
			}
			if (subtitleRef.current) {
				subtitleRef.current.style.opacity = String(Math.max(0, 1 - p * 1.6))
				subtitleRef.current.style.maxHeight = `${(1 - p) * 24}px`
			}
			if (headerRef.current) {
				// with no persistent divider, fade a hairline in as content scrolls under
				if (!divider) {
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
	}, [divider])

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
			{/* header — a compact row (back · title · actions); the title shrinks on
			    scroll (see effect above) */}
			<Box
				ref={headerRef}
				sx={{
					flexShrink: 0,
					zIndex: HEADER_Z,
					display: 'flex',
					flexDirection: 'column',
					paddingTop: `calc(${TOOLBAR_SPACER} + 12px)`,
					paddingBottom: 1,
					bgcolor: surface,
					borderBottom: '1px solid',
					borderColor: divider ? 'grey.200' : 'transparent',
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
							sx={{
								fontSize: `${TITLE_MAX}rem`,
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
						{subtitle && (
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
					paddingX: 2,
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
