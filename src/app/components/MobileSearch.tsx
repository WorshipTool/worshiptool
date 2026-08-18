'use client'

import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { Box, Button, Typography } from '@/common/ui'
import { GroupRowsSkeleton, ListStateView, SongGroup } from '@/common/ui/GroupList'
import { TextField } from '@/common/ui/TextField'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { SearchKey } from '@/types/song/search.types'
import { SearchRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

const PREVIEW_LINES = 2

/** Room Cancel is given as it slides in; anything ≥ its own width will do. */
const CANCEL_MAX_WIDTH = 120
const ACTIVATE_MS = 220

type BarProps = {
	/** Raw field value (undebounced), owned by the home page like on desktop. */
	value: string
	onValueChange: (value: string) => void
	/** Whether the screen is in search mode. */
	active: boolean
	/** Focusing the field is what starts searching. */
	onActivate: () => void
	onCancel: () => void
	inputRef?: React.Ref<HTMLInputElement>
}

/**
 * Home's search bar — one element in both states, never swapped for another, so
 * activating it is a transition rather than a cut. It is a real field
 * throughout: focusing it is what starts searching, the way an iOS search bar
 * works, and Cancel slides in beside it as its dismiss control.
 *
 * Cancel is the visible way back; the tabs and the Back gesture work too, but
 * neither is on the screen.
 */
export function MobileSearchBar({
	value,
	onValueChange,
	active,
	onActivate,
	onCancel,
	inputRef,
}: BarProps) {
	const tSearch = useTranslations('search')
	const tCommon = useTranslations('common')

	return (
		<Box
			sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}
			// focus bubbles, so the field doesn't need a handler of its own
			onFocus={onActivate}
		>
			<Box
				component="form"
				onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
					// Enter closes the keyboard; the query is already live
					e.preventDefault()
					;(
						e.currentTarget.querySelector('input') as HTMLInputElement | null
					)?.blur()
				}}
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					flex: 1,
					minWidth: 0,
					bgcolor: 'background.paper',
					border: '1px solid',
					borderColor: active ? 'primary.main' : 'grey.300',
					borderRadius: 2.5,
					paddingX: 2,
					paddingY: 1.5,
					boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
					transition: `border-color ${ACTIVATE_MS}ms ease`,
				}}
			>
				<SearchRounded sx={{ color: 'grey.500' }} />
				<TextField
					value={value}
					onChange={onValueChange}
					// the short one: Cancel takes the room a longer placeholder would
					// need, and an input has no ellipsis to cut it politely
					placeholder={tSearch('searchSongs')}
					inputRef={inputRef}
					sx={{ '& input': { padding: 0 } }}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					overflow: 'hidden',
					flexShrink: 0,
					maxWidth: active ? `${CANCEL_MAX_WIDTH}px` : 0,
					opacity: active ? 1 : 0,
					transition: `max-width ${ACTIVATE_MS}ms ease, opacity ${ACTIVATE_MS}ms ease`,
				}}
			>
				<Button variant="text" onClick={onCancel} disableUppercase>
					{tCommon('cancel')}
				</Button>
			</Box>
		</Box>
	)
}

type BodyProps = {
	/** Debounced query actually sent to the API; null until the first one lands. */
	searchString: string | null
	smartSearch: boolean
}

/**
 * What home shows while searching, in place of its recommendations — searching
 * is a mode of the home screen rather than a layer over it, so the header (with
 * the field) stays put and only the body underneath changes.
 *
 * Empty until something is typed, deliberately: filling it with recommendations
 * would look exactly like the home screen it replaced, so tapping the bar would
 * seem to do nothing but grow a Cancel button.
 *
 * The list bodies are the shared GroupList primitives, so results look identical
 * to every other song list in the app.
 */
export default function MobileSearchBody({
	searchString,
	smartSearch,
}: BodyProps) {
	const tSearch = useTranslations('search')

	if (searchString)
		return <SearchResults searchString={searchString} smartSearch={smartSearch} />

	return (
		<ListStateView
			icon={<SearchRounded fontSize="inherit" />}
			message={tSearch('searchSong')}
		/>
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
