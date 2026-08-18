'use client'

import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { Box, Button, Clickable, Typography } from '@/common/ui'
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

/**
 * The bar itself, shared by the resting entry and the live field so tapping it
 * doesn't resize the header. Only the border colour tells the two apart.
 */
const BAR_SX = {
	display: 'flex',
	alignItems: 'center',
	gap: 1.5,
	bgcolor: 'background.paper',
	border: '1px solid',
	borderRadius: 2.5,
	paddingX: 2,
	paddingY: 1.5,
	boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
	minWidth: 0,
}

/**
 * Home's search bar at rest: a button dressed as a field. Tapping it starts
 * searching — there is no input to focus until then, so the keyboard never
 * opens by surprise on a screen you only meant to browse.
 */
export function MobileSearchEntry({ onOpen }: { onOpen: () => void }) {
	const tSearch = useTranslations('search')
	return (
		<Clickable onClick={onOpen}>
			<Box sx={{ ...BAR_SX, borderColor: 'grey.300' }}>
				<SearchRounded sx={{ color: 'grey.500' }} />
				<Typography color="grey.500" noWrap>
					{tSearch('searchByTitleOrText')}
				</Typography>
			</Box>
		</Clickable>
	)
}

type FieldProps = {
	/** Raw field value (undebounced), owned by the home page like on desktop. */
	value: string
	onValueChange: (value: string) => void
	onCancel: () => void
}

/**
 * The same bar while searching: a live field with Cancel beside it, the way iOS
 * hands a search bar its dismiss control. Cancel is the visible way back — the
 * tabs and the Back gesture also work, but neither is on the screen.
 */
export function MobileSearchField({ value, onValueChange, onCancel }: FieldProps) {
	const tSearch = useTranslations('search')
	const tCommon = useTranslations('common')

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
			<Box
				component="form"
				onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
					// Enter closes the keyboard; the query is already live
					e.preventDefault()
					;(
						e.currentTarget.querySelector('input') as HTMLInputElement | null
					)?.blur()
				}}
				sx={{ ...BAR_SX, borderColor: 'primary.main', flex: 1 }}
			>
				<SearchRounded sx={{ color: 'grey.500' }} />
				<TextField
					autoFocus
					value={value}
					onChange={onValueChange}
					// the short placeholder: Cancel takes the room the resting bar's
					// longer one needs, and an input has no ellipsis to cut it politely
					placeholder={tSearch('searchSongs')}
					// match the resting bar's text box exactly, so the header doesn't
					// change height the moment you tap it
					sx={{ '& input': { padding: 0 } }}
				/>
			</Box>
			<Button variant="text" onClick={onCancel} disableUppercase>
				{tCommon('cancel')}
			</Button>
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
