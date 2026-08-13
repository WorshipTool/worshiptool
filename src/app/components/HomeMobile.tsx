'use client'

import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
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
	SearchRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75

type HomeMobileProps = {
	searchInputValue: string
	onSearchValueChange: (value: string) => void
	searchString: string | null
	smartSearch: boolean
}

/**
 * Native-feeling mobile home. Same flow as the desktop home, in a phone's
 * clothes: hero (the shell's large title) → search field → results →
 * recommendations, with the field staying put and the recommendations staying
 * visible while you search. The desktop layout stays in HomeDesktop; this
 * component owns the phone view.
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

	// The tab bar's raised search button links here and fires MAIN_SEARCH_EVENT,
	// exactly like the desktop toolbar's "Hledat" item does. Only MainSearchInput
	// listened for it, and that is desktop-only — so on a phone the bar's primary
	// action used to do nothing visible.
	//
	// The field scrolls with the content, so reaching it means scrolling back to
	// the top first — which is precisely what the desktop handler does
	// (window.scrollTo, then focus). Driving it through the shell's own
	// scroll-to-top signal keeps the scrolling inside the one scroller, so iOS is
	// never the one deciding to bring the field into view.
	const searchInputRef = useRef<HTMLInputElement>(null)
	const [scrollTopSignal, setScrollTopSignal] = useState(0)
	const focusSearch = useCallback(() => {
		setScrollTopSignal((n) => n + 1)
		searchInputRef.current?.focus()
	}, [])

	useEffect(() => {
		window.addEventListener(MAIN_SEARCH_EVENT_NAME, focusSearch)
		return () => window.removeEventListener(MAIN_SEARCH_EVENT_NAME, focusSearch)
	}, [focusSearch])

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

	// ---- search: buttonless field with a primary gradient border, pinned under
	// the header the way the desktop one stays pinned under the hero

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
		// Home is a tab-root, so no back arrow — otherwise the same shell as every
		// other screen: large title that shrinks to a slim bar on scroll, with only
		// the content between it and the tab bar scrolling.
		//
		// The title/subtitle are the desktop hero and the field below them is its
		// search input — same order, same at-rest look. It stays part of the
		// content rather than being pinned as chrome: a permanently docked field
		// costs a phone its scarcest resource (height) even while you are only
		// browsing. Scrolled away it is one tap on the tab bar's Hledat away.
		<MobileAppHeader
			title={tHome('hero.title')}
			subtitle={tHome('hero.lead')}
			scrollResetKey={scrollTopSignal}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
					paddingTop: 1,
				}}
			>
				{search}
				{/* Results sit above the recommendations rather than replacing them,
				    as on desktop — so the home screen never blanks out mid-typing and
				    clearing the field leaves you where you started. */}
				{searchString && (
					<MobileSearchResults
						searchString={searchString}
						smartSearch={smartSearch}
					/>
				)}
				{picks}
				{recent}
			</Box>
		</MobileAppHeader>
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
