'use client'

import { BasicVariantPack } from '@/api/dtos'
import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { ABOVE_TABBAR_SLOT_ID } from '@/common/components/MobileAppTabBar/nav.constants'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { TextField } from '@/common/ui/TextField'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { SearchKey } from '@/types/song/search.types'
import {
	ChevronRightRounded,
	CloudOffRounded,
	MusicNoteRounded,
	SearchRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75

type HomeMobileProps = {
	searchInputValue: string
	onSearchValueChange: (value: string) => void
	searchString: string | null
	smartSearch: boolean
}

/**
 * Native-feeling mobile home: a flat light-grey canvas with white grouped
 * lists (recommended picks, a quiet "last added"), a docked search in the
 * thumb zone and the bottom tab bar. The desktop layout stays in HomeDesktop;
 * this component owns the phone view.
 */
export default function HomeMobile({
	searchInputValue,
	onSearchValueChange,
	searchString,
	smartSearch,
}: HomeMobileProps) {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tSearch = useTranslations('search')

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()
	const rec = recommended.data
	const last = lastAdded.data
	const searching = searchInputValue.trim().length > 0

	// The tab bar's raised search button links here and fires MAIN_SEARCH_EVENT.
	// Only MainSearchInput listened for it, and that is desktop-only — so on a
	// phone the bar's primary action used to do nothing visible.
	//
	// Deliberately only on the event (i.e. off a real tap, which is also what iOS
	// requires before it will open the keyboard) and not on mount: the field is
	// docked at the bottom inside the tab bar's fixed layer, and focusing it
	// without a gesture makes iOS scroll it into view — which drags the whole
	// page down and tucks the header under the status bar.
	const searchInputRef = useRef<HTMLInputElement>(null)
	const focusSearch = useCallback(() => {
		searchInputRef.current?.focus()
	}, [])

	useEffect(() => {
		window.addEventListener(MAIN_SEARCH_EVENT_NAME, focusSearch)
		return () => window.removeEventListener(MAIN_SEARCH_EVENT_NAME, focusSearch)
	}, [focusSearch])

	// the docked search is portalled into the tab bar's slot so it stacks on
	// top of the bar via layout (see nav.constants.ABOVE_TABBAR_SLOT_ID)
	const [tabBarSlot, setTabBarSlot] = useState<HTMLElement | null>(null)
	useEffect(() => {
		setTabBarSlot(document.getElementById(ABOVE_TABBAR_SLOT_ID))
	}, [])

	// The docked search overlays the bottom of the shell's scroller (it lives in
	// the tab bar's fixed slot, which the shell's height doesn't know about).
	// Measure it rather than hardcoding a clearance, so the last row stays
	// reachable however tall the field ends up.
	const searchDockRef = useRef<HTMLDivElement>(null)
	const [searchDockHeight, setSearchDockHeight] = useState(0)
	useEffect(() => {
		const el = searchDockRef.current
		if (!el) return
		const measure = () => setSearchDockHeight(el.offsetHeight)
		const observer = new ResizeObserver(measure)
		observer.observe(el)
		measure()
		return () => observer.disconnect()
	}, [tabBarSlot])

	const label = (text: string, action?: ReactNode) => (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, paddingX: 0.5 }}>
			<Typography small strong uppercase color="grey.700">
				{text}
			</Typography>
			{action}
		</Box>
	)

	const browseAction = (
		<Clickable>
			<Link to="songsList" params={{ s: undefined }}>
				<Typography small strong uppercase color="primary.main">
					{tHome('allList.browse')}
				</Typography>
			</Link>
		</Clickable>
	)

	// ---- picks: one white S5 group on the grey canvas ----------------

	const picks = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			{recommended.isLoading ? (
				<Skeleton variant="rounded" sx={{ height: 288, borderRadius: 3, bgcolor: 'grey.200' }} />
			) : recommended.isError ? (
				<SectionError message={tHome('recommended.error')} />
			) : (
				<SongGroup songs={rec.slice(0, 5)} previewLines={PREVIEW_LINES} />
			)}
		</Box>
	)

	// ---- recent: quiet text-only S5 group (like the playlists list) ---

	const dateOf = (publishedAt?: Date | null) => (publishedAt ? getSmartDateAgoString(publishedAt) : '')

	const recentInner = lastAdded.isLoading ? (
		<Skeleton variant="rounded" sx={{ height: 220, borderRadius: 3, bgcolor: 'grey.200' }} />
	) : lastAdded.isError ? (
		<SectionError message={tHome('recommended.error')} />
	) : (
		<Box sx={GROUP_CARD_SX}>
			{last.slice(0, 5).map((s, i) => (
				<Fragment key={s.packGuid}>
					<Clickable>
						<Link to="variant" params={parseVariantAlias(s.packAlias)}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1.5,
									paddingX: 1.75,
									paddingY: 1.25,
									transition: 'background-color 0.15s ease',
									'&:active': { bgcolor: 'grey.100' },
								}}
							>
								<Typography noWrap sx={{ flex: 1 }}>
									{s.title}
								</Typography>
								<Typography small color="grey.600" noWrap>
									{dateOf(s.publishedAt)}
								</Typography>
								<ChevronRightRounded fontSize="small" sx={{ color: 'grey.400' }} />
							</Box>
						</Link>
					</Clickable>
					{i < Math.min(last.length, 5) - 1 && (
						<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: TEXT_DIVIDER_INSET }} />
					)}
				</Fragment>
			))}
		</Box>
	)

	const recent = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(tHome('lastAdded.title'))}
			{recentInner}
		</Box>
	)

	// ---- docked search: buttonless field with a primary gradient border

	const search = (
		<Box
			component="form"
			onSubmit={(e) => {
				e.preventDefault()
				;(e.currentTarget.querySelector('input') as HTMLInputElement | null)?.blur()
			}}
			sx={{
				background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
				borderRadius: 2,
				padding: '2px',
				boxShadow: 2,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					bgcolor: 'background.paper',
					borderRadius: 1.75,
					paddingX: 1.75,
					paddingY: 1.25,
					minWidth: 0,
				}}
			>
				<SearchRounded sx={{ color: 'grey.500', fontSize: 20 }} />
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<TextField inputRef={searchInputRef} value={searchInputValue} onChange={onSearchValueChange} placeholder={tSearch('searchByTitleOrText')} />
				</Box>
			</Box>
		</Box>
	)

	return (
		<>
			{/* Home is a tab-root, so no back arrow — otherwise the same shell as
			    every other screen: large title that shrinks to a slim bar on scroll,
			    with only the content between it and the tab bar scrolling. */}
			<MobileAppHeader
				title={tHome('hero.title')}
				subtitle={tHome('hero.lead')}
			>
				{searching ? (
					<Box sx={{ paddingTop: 1, paddingBottom: `${searchDockHeight}px` }}>
						{searchString ? (
							<MobileSearchResults searchString={searchString} smartSearch={smartSearch} />
						) : (
							// the search box is debounced: for ~300ms after the first
							// keystroke there is no query yet. The picks are already
							// hidden by then, so show the results skeleton rather than
							// leaving an empty canvas.
							<SearchResultsFrame>
								<SearchResultsSkeleton />
							</SearchResultsFrame>
						)}
					</Box>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 3,
							paddingTop: 1,
							paddingBottom: `${searchDockHeight}px`,
						}}
					>
						{picks}
						{recent}
					</Box>
				)}
			</MobileAppHeader>

			{/* ===== SEARCH: portalled into the tab bar's slot so it stacks on
			    top of the bar via layout (thumb zone, no magic offsets) ===== */}
			{tabBarSlot &&
				createPortal(
					<Box
						ref={searchDockRef}
						sx={{
							width: '100%',
							paddingX: 2,
							paddingTop: 1,
							paddingBottom: 1.25,
							boxSizing: 'border-box',
							bgcolor: 'grey.50',
						}}
					>
						{search}
					</Box>,
					tabBarSlot
				)}
		</>
	)
}

/**
 * Search results as white floating cards (matching the recommended picks),
 * paginated with infinite scroll — same data flow as the shared
 * SearchedSongsList, just rendered in the mobile home's card language.
 */
function MobileSearchResults({ searchString, smartSearch }: { searchString: string; smartSearch: boolean }) {
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

	const { nextPage: loadNext, loadPage, data: songs, nextExists } = usePagination<SearchSongDto>(func)

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

	return (
		<SearchResultsFrame>
			{packs.length > 0 ? (
				<SongGroup songs={packs} previewLines={PREVIEW_LINES} />
			) : loading ? (
				<SearchResultsSkeleton />
			) : (
				<Typography color="grey.600">{tHome('search.noResults')}</Typography>
			)}
			<Box ref={loadNextRef} sx={{ height: 1 }} />
		</SearchResultsFrame>
	)
}

/**
 * A home section whose data failed to load. Home used to render an empty white
 * card in this case, with nothing telling the user what happened.
 */
function SectionError({ message }: { message: string }) {
	return (
		<Box
			sx={{
				...GROUP_CARD_SX,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 1,
				paddingY: 4,
				paddingX: 3,
				textAlign: 'center',
			}}
		>
			<CloudOffRounded sx={{ fontSize: 40, color: 'grey.400' }} />
			<Typography color="grey.600">{message}</Typography>
		</Box>
	)
}

/** Title + body wrapper shared by the results list and its pre-query skeleton. */
function SearchResultsFrame({ children }: { children: ReactNode }) {
	const tHome = useTranslations('home')
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Typography small strong uppercase color="grey.700" sx={{ paddingX: 0.5 }}>
				{tHome('search.resultsTitle')}
			</Typography>
			{children}
		</Box>
	)
}

function SearchResultsSkeleton() {
	return (
		<Skeleton
			variant="rounded"
			sx={{ height: 288, borderRadius: 3, bgcolor: 'grey.200' }}
		/>
	)
}
