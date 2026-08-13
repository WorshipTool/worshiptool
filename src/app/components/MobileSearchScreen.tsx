'use client'

import { BasicVariantPack } from '@/api/dtos'
import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { Z_INDEX } from '@/common/constants/zIndex'
import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { GroupRowsSkeleton, ListStateView, SongGroup } from '@/common/ui/GroupList'
import { Box, Button, Typography, useTheme } from '@/common/ui'
import { TextField } from '@/common/ui/TextField'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { SearchKey } from '@/types/song/search.types'
import { SearchRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

const PREVIEW_LINES = 2
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'

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
	onClose: () => void
}

/**
 * Full-screen search, opened from the tab bar's Hledat action.
 *
 * A phone has no room to keep a search field on screen the way the desktop home
 * does, so searching becomes a mode instead of a permanent strip: the layer
 * covers the whole viewport (tab bar included), the field sits at the top with
 * the keyboard under it, and results fill everything between. Closing it leaves
 * the home screen exactly as it was.
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
	onClose,
}: MobileSearchScreenProps) {
	const theme = useTheme()
	const tCommon = useTranslations('common')
	const tSearch = useTranslations('search')
	const tHome = useTranslations('home')

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: Z_INDEX.OVERLAY,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				[theme.breakpoints.up(MOBILE_NAV_BREAKPOINT)]: { display: 'none' },
			}}
		>
			{/* field + Zrušit, pinned; the keyboard opens directly beneath it */}
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					paddingTop: `calc(${TOOLBAR_SPACER} + 12px)`,
					paddingBottom: 1.25,
					paddingX: 2,
					bgcolor: 'grey.50',
					borderBottom: '1px solid',
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
				<Button variant="text" onClick={onClose} disableUppercase>
					{tCommon('cancel')}
				</Button>
			</Box>

			{/* the only scroller in the layer */}
			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: 'auto',
					overflowX: 'hidden',
					paddingX: 2,
					paddingTop: 1.5,
					paddingBottom: 2,
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
		</Box>
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
