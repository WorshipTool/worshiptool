'use client'

import { BasicVariantPack } from '@/api/dtos'
import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { Z_INDEX } from '@/common/constants/zIndex'
import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { GroupRowsSkeleton, ListStateView, SongGroup } from '@/common/ui/GroupList'
import { Box, Typography, useTheme } from '@/common/ui'
import { TextField } from '@/common/ui/TextField'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { SearchKey } from '@/types/song/search.types'
import { SearchRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PREVIEW_LINES = 2
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
// height the visual viewport must lose before we call it a keyboard rather than
// a browser chrome nudge
const KEYBOARD_THRESHOLD = 120

/**
 * Tracks the visual viewport so a bottom-anchored control can sit on top of the
 * keyboard. iOS does not shrink the layout viewport when the keyboard opens, so
 * `position: fixed; bottom: 0` lands *behind* it — the height has to come from
 * visualViewport instead. Returns null until measured (and on browsers without
 * the API), where full height is the right fallback.
 */
function useVisualViewport() {
	const [viewport, setViewport] = useState<{
		height: number
		offsetTop: number
		keyboardOpen: boolean
	} | null>(null)

	useEffect(() => {
		const vv = window.visualViewport
		if (!vv) return
		let raf = 0
		const measure = () => {
			raf = 0
			setViewport({
				height: vv.height,
				offsetTop: vv.offsetTop,
				keyboardOpen: window.innerHeight - vv.height > KEYBOARD_THRESHOLD,
			})
		}
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(measure)
		}
		vv.addEventListener('resize', schedule)
		vv.addEventListener('scroll', schedule)
		measure()
		return () => {
			vv.removeEventListener('resize', schedule)
			vv.removeEventListener('scroll', schedule)
			if (raf) cancelAnimationFrame(raf)
		}
	}, [])

	return viewport
}

type MobileSearchScreenProps = {
	/** Raw field value (undebounced), owned by the home page like on desktop. */
	value: string
	onValueChange: (value: string) => void
	/** Debounced query actually sent to the API; null until the first one lands. */
	searchString: string | null
	smartSearch: boolean
	/**
	 * Songs to offer before anything is typed. Home has them loaded already, so
	 * they cost nothing here and keep the opening screen from being blank.
	 */
	suggestions?: BasicVariantPack[]
}

/**
 * Full-screen search, opened from the tab bar's raised Hledat action.
 *
 * A phone has no room to keep a search field on screen the way the desktop home
 * does, so searching is a mode instead of a permanent strip: the layer covers
 * the whole viewport (tab bar included) and closing it leaves the home screen
 * exactly as it was.
 *
 * The field sits at the *bottom*, directly above the keyboard, which is what
 * Apple's HIG asks for — "Place search at the bottom if there's room […] it
 * keeps the search experience easy to reach" — and specifically what a search
 * tab styled as a separate round button is supposed to do: the keyboard appears
 * immediately with the field above it. A field at the top would be the other
 * HIG style (a uniform tab opening a landing page), which does not match the
 * round button we have in the tab bar. Suggestions and results sit above the
 * field, in normal order, as in YouTube Music's bottom search.
 *
 * Its own fixed layer rather than a MobileAppHeader: the shell's chrome is a
 * collapsing title over a tab bar, which is the opposite of what this needs.
 * The list bodies are the shared GroupList primitives, so the results look
 * identical to every other song list in the app.
 */
export default function MobileSearchScreen({
	value,
	onValueChange,
	searchString,
	smartSearch,
	suggestions,
}: MobileSearchScreenProps) {
	const theme = useTheme()
	const tSearch = useTranslations('search')
	const tHome = useTranslations('home')
	const viewport = useVisualViewport()

	// Rendered into the body: a fixed layer positions against the viewport only
	// while no ancestor has a transform/filter/containment, and any of those
	// would silently trap it inside that ancestor's box instead.
	const [host, setHost] = useState<HTMLElement | null>(null)
	useEffect(() => setHost(document.body), [])
	if (!host) return null

	return createPortal(
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				// Bound by the visual viewport, not the layout one, so the bottom edge
				// is the top of the keyboard rather than the top of the screen behind it.
				height: viewport ? `${viewport.height}px` : '100%',
				transform: viewport ? `translateY(${viewport.offsetTop}px)` : undefined,
				zIndex: Z_INDEX.OVERLAY,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
			}}
		>
			{/* results/suggestions scroll above the field, in reading order */}
			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: 'auto',
					overflowX: 'hidden',
					paddingX: 2,
					paddingTop: `calc(${TOOLBAR_SPACER} + 12px)`,
					paddingBottom: 1.5,
				}}
			>
				{searchString ? (
					<SearchResults searchString={searchString} smartSearch={smartSearch} />
				) : suggestions && suggestions.length > 0 ? (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Typography
							small
							strong
							uppercase
							color="grey.700"
							sx={{ paddingX: 0.5 }}
						>
							{tHome('recommended.idea')}
						</Typography>
						<SongGroup songs={suggestions} previewLines={PREVIEW_LINES} />
					</Box>
				) : (
					<ListStateView
						icon={<SearchRounded fontSize="inherit" />}
						message={tSearch('searchSong')}
					/>
				)}
			</Box>

			{/* the field, anchored to the bottom edge — i.e. on top of the keyboard
			    once it opens */}
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					paddingTop: 1.25,
					// with the keyboard up, the home indicator sits behind it, so the
					// safe-area inset would only add a dead gap
					paddingBottom: viewport?.keyboardOpen
						? 1.25
						: 'calc(env(safe-area-inset-bottom) + 12px)',
					paddingX: 2,
					bgcolor: 'grey.50',
					borderTop: '1px solid',
					borderColor: 'grey.200',
				}}
			>
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault()
						;(
							e.currentTarget.querySelector('input') as HTMLInputElement | null
						)?.blur()
					}}
					sx={{
						flex: 1,
						minWidth: 0,
						background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
						borderRadius: 2,
						padding: '2px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							bgcolor: 'background.paper',
							borderRadius: 1.75,
							paddingX: 1.5,
							paddingY: 1,
							minWidth: 0,
						}}
					>
						<SearchRounded sx={{ color: 'grey.500', fontSize: 20 }} />
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<TextField
								autoFocus
								value={value}
								onChange={onValueChange}
								placeholder={tSearch('searchByTitleOrText')}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>,
		host
	)
}

/**
 * Paginated results with infinite scroll — the same data flow as the desktop
 * SearchedSongsList, rendered with the shared grouped-list primitives.
 */
function SearchResults({
	searchString,
	smartSearch,
}: {
	searchString: string
	smartSearch: boolean
}) {
	const tHome = useTranslations('home')
	const searchSongs = useSongSearch()
	const loadNextRef = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState(true)
	const [enableLoadNext, setEnableLoadNext] = useState(false)

	const func = useCallback(
		(page: number, resolve: (a: SearchSongDto[]) => void) => {
			searchSongs(searchString as SearchKey, { page, useSmartSearch: smartSearch })
				.then((data) => {
					setLoading(false)
					resolve(data)
				})
				.catch(() => {
					setLoading(false)
					resolve([])
				})
		},
		[searchString, smartSearch, searchSongs]
	)

	const {
		nextPage: loadNext,
		loadPage,
		data: songs,
		nextExists,
	} = usePagination<SearchSongDto>(func)

	// Phone searches were missing from analytics entirely: the desktop list tracks
	// them (SearchedSongsList) and this one is a separate implementation.
	const lastTrackedSearchRef = useRef<string | null>(null)

	useEffect(() => {
		setEnableLoadNext(false)
		setLoading(true)
		if (
			searchString.trim().length > 0 &&
			searchString !== lastTrackedSearchRef.current
		) {
			lastTrackedSearchRef.current = searchString
			Analytics.track('SEARCH', {
				query: searchString,
				smartSearch: Boolean(smartSearch),
			})
		}
		loadPage(0, true).finally(() => setEnableLoadNext(true))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchString, smartSearch])

	useIsInViewport(loadNextRef, '200px', (intersecting) => {
		if (!enableLoadNext || !intersecting) return
		if (songs.length > 0 && nextExists) loadNext()
	})

	const packs = songs.flatMap((s) => s.found)

	if (loading && packs.length === 0) return <GroupRowsSkeleton rows={6} withIcon />

	if (packs.length === 0)
		return (
			<ListStateView
				icon={<SearchRounded fontSize="inherit" />}
				message={tHome('search.noResults')}
			/>
		)

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Typography small strong uppercase color="grey.700" sx={{ paddingX: 0.5 }}>
				{tHome('search.resultsTitle')}
			</Typography>
			<SongGroup songs={packs} previewLines={PREVIEW_LINES} />
			<Box ref={loadNextRef} sx={{ height: 1 }} />
		</Box>
	)
}
