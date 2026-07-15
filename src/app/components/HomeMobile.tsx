'use client'

import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import MobileAppTabBar from '@/common/components/MobileAppTabBar/MobileAppTabBar'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { TextField } from '@/common/ui/TextField'
import useAuth from '@/hooks/auth/useAuth'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { SearchKey } from '@/types/song/search.types'
import { ChevronRightRounded, LoginRounded, PersonRounded, SearchRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const PAGE_MAX_WIDTH = 480
const TOOLBAR_SPACER = '56px' // sticky TopBar spacer height (Toolbar.tsx)
const TAB_BAR = 'calc(env(safe-area-inset-bottom) + 64px)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 176px)'
const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

// the chosen "deep soft" white → grey wash
const WASH_HEIGHT = 400
const WASH_SOLID_STOP = 25
const WASH_GREY_STOP = 100

type HomeMobileProps = {
	searchInputValue: string
	onSearchValueChange: (value: string) => void
	searchString: string | null
	smartSearch: boolean
}

/**
 * Native-feeling mobile home: a grey canvas with a soft white → grey wash at
 * the top, white "recommended" cards floating on the grey, a quiet "last
 * added" list, a docked search in the thumb zone and a blue bottom tab bar.
 * The desktop layout stays in HomeDesktop; this component owns the phone view.
 */
export default function HomeMobile({
	searchInputValue,
	onSearchValueChange,
	searchString,
	smartSearch,
}: HomeMobileProps) {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')
	const tSearch = useTranslations('search')
	const { isLoggedIn } = useAuth()

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()
	const rec = recommended.data
	const last = lastAdded.data
	const loading = recommended.isLoading || lastAdded.isLoading

	const loggedIn = isLoggedIn()
	const searching = searchInputValue.trim().length > 0

	// ---- header ------------------------------------------------------

	const accountButton = (
		<Box
			aria-label={loggedIn ? tNav('account') : tNav('login')}
			sx={{ width: 42, height: 42, borderRadius: 10, bgcolor: 'grey.100', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			{loggedIn ? <PersonRounded fontSize="small" /> : <LoginRounded fontSize="small" />}
		</Box>
	)

	const header = (
		<Box
			sx={{
				paddingX: 2.5,
				paddingTop: 'calc(env(safe-area-inset-top) + 32px)',
				paddingBottom: 0.5,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'end',
			}}
		>
			<Box>
				<Typography small color="grey.700">
					{tHome('hero.lead')}
				</Typography>
				<Typography variant="h3" strong={800}>
					{tHome('hero.title')}
				</Typography>
			</Box>
			<Clickable tooltip={loggedIn ? tNav('account') : tNav('login')}>
				{loggedIn ? (
					<Link to="account" params={{}}>
						{accountButton}
					</Link>
				) : (
					<Link to="login" params={{ previousPage: '', message: '' }}>
						{accountButton}
					</Link>
				)}
			</Clickable>
		</Box>
	)

	const label = (text: string, action?: ReactNode) => (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, paddingX: 0.5 }}>
			<Typography small strong uppercase color="grey.700">
				{text.replace(/:$/, '')}
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

	// ---- picks: white cards floating on the grey canvas --------------

	const picks = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }} />
					  ))
					: rec.slice(0, 5).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense previewLines={PREVIEW_LINES} sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }} />
					  ))}
			</Box>
		</Box>
	)

	// ---- recent: quiet airy list so it recedes -----------------------

	const dateOf = (publishedAt?: Date | null) => (publishedAt ? getSmartDateAgoString(publishedAt) : '')

	const recentInner = loading ? (
		Array.from({ length: 4 }).map((_, i) => (
			<Skeleton key={i} variant="rounded" sx={{ height: 32, borderRadius: 1, bgcolor: 'grey.200' }} />
		))
	) : (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
			{last.slice(0, 5).map((s) => (
				<Clickable key={s.packGuid}>
					<Link to="variant" params={parseVariantAlias(s.packAlias)}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1 }}>
							<Typography color="grey.700" noWrap sx={{ flex: 1 }}>
								{s.title}
							</Typography>
							<Typography small color="grey.400" noWrap>
								{dateOf(s.publishedAt)}
							</Typography>
							<ChevronRightRounded fontSize="small" sx={{ color: 'grey.300' }} />
						</Box>
					</Link>
				</Clickable>
			))}
		</Box>
	)

	const recent = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
					<TextField value={searchInputValue} onChange={onSearchValueChange} placeholder={tSearch('searchByTitleOrText')} />
				</Box>
			</Box>
		</Box>
	)

	const heroBg = `linear-gradient(to bottom, ${theme.palette.common.white} 0%, ${theme.palette.common.white} ${WASH_SOLID_STOP}%, ${theme.palette.grey[100]} ${WASH_GREY_STOP}%)`

	return (
		<Box
			sx={{
				// full-bleed: escape the SmartPage padded wrapper and the toolbar spacer
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.300',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: PAGE_MAX_WIDTH,
					minWidth: 0,
					minHeight: '100dvh',
					bgcolor: 'grey.100', // the grey canvas that white cards float on
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* soft white → grey wash behind the top; fades out inside the picks */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: `calc(env(safe-area-inset-top) + ${WASH_HEIGHT}px)`,
						background: heroBg,
						zIndex: 0,
						pointerEvents: 'none',
					}}
				/>
				<Box sx={{ position: 'relative', zIndex: 1 }}>
					{header}
					{searching ? (
						<Box sx={{ paddingX: 2.5, paddingTop: 2, paddingBottom: CONTENT_CLEARANCE }}>
							{searchString ? <MobileSearchResults searchString={searchString} smartSearch={smartSearch} /> : null}
						</Box>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2, paddingBottom: CONTENT_CLEARANCE }}>
							{picks}
							{recent}
						</Box>
					)}
				</Box>

				{/* ===== SEARCH: docked above the tab bar (thumb zone) ===== */}
				<Box
					sx={{
						position: 'fixed',
						bottom: TAB_BAR,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						paddingX: 2.5,
						paddingBottom: 1.5,
						boxSizing: 'border-box',
						zIndex: 10,
					}}
				>
					{search}
				</Box>

				{/* ===================== BOTTOM TAB BAR ===================== */}
				<MobileAppTabBar />
			</Box>
		</Box>
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

	useEffect(() => {
		setEnableLoadNext(false)
		setLoading(true)
		loadPage(0, true).finally(() => setEnableLoadNext(true))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchString, smartSearch])

	useIsInViewport(loadNextRef, '200px', (intersecting) => {
		if (!enableLoadNext || !intersecting) return
		if (songs.length > 0 && nextExists) loadNext()
	})

	const packs = songs.flatMap((s) => s.found)

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Typography small strong uppercase color="grey.700" sx={{ paddingX: 0.5 }}>
				{tHome('search.resultsTitle').replace(/:$/, '')}
			</Typography>
			{packs.length > 0 ? (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					{packs.map((p) => (
						<SongVariantCard key={p.packGuid} data={p} dense previewLines={PREVIEW_LINES} sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }} />
					))}
				</Box>
			) : loading ? (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} variant="rounded" sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }} />
					))}
				</Box>
			) : (
				<Typography color="grey.600">{tHome('search.noResults')}</Typography>
			)}
			<Box ref={loadNextRef} sx={{ height: 1 }} />
		</Box>
	)
}
