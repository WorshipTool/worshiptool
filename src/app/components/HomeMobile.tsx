'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { TextField } from '@/common/ui/TextField'
import useAuth from '@/hooks/auth/useAuth'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import useSongSearch from '@/hooks/song/useSongSearch'
import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import { SearchKey } from '@/types/song/search.types'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
	ChevronRightRounded,
	HomeOutlined,
	HomeRounded,
	LibraryMusicOutlined,
	LibraryMusicRounded,
	LoginRounded,
	PersonOutlineRounded,
	PersonRounded,
	SearchRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode, useEffect, useState } from 'react'
import MainSearchInput from './components/MainSearchInput'
import SearchedSongsList from './components/SearchedSongsList'

const PAGE_MAX_WIDTH = 480
const TOOLBAR_SPACER = '56px' // sticky TopBar spacer height (Toolbar.tsx)
const TAB_BAR = 'calc(env(safe-area-inset-bottom) + 64px)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 176px)'

// the chosen "deep soft" white → grey wash (demo variant 4)
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
 * added" list, a docked search in the thumb zone and a bottom tab bar. The
 * desktop layout stays in HomeDesktop; this component owns the phone view.
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

	// temporary variant switches (remove once a look is chosen):
	//   ?sf= search field   1 = white gradient-border (default) · 2 = house MainSearchInput
	//   ?sr= search results 2 = white cards (default) · 1 = shared list · 3 = quiet list
	//   ?cl= card lines     2 = two preview lines (default) · 1 = single line
	//   ?tb= tab bar        1 = white blur (default) · 2 = blue primary gradient
	const [sfParam] = useUrlState('sf')
	const [srParam] = useUrlState('sr')
	const [clParam] = useUrlState('cl')
	const [tbParam] = useUrlState('tb')
	const sf = Number(sfParam) === 2 ? 2 : 1
	const sr = Number(srParam) === 1 ? 1 : Number(srParam) === 3 ? 3 : 2
	const previewLines = Number(clParam) === 1 ? 1 : 2
	const blueTab = Number(tbParam) === 2

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
							<Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 2, bgcolor: 'grey.200' }} />
					  ))
					: rec.slice(0, 5).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense previewLines={previewLines} sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }} />
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

	// ---- search results (when the docked search has text) ------------

	const results = (
		<Box sx={{ paddingX: 2.5 }}>
			{searchString ? (
				sr === 1 ? (
					<SearchedSongsList searchString={searchString} useSmartSearch={smartSearch} dense />
				) : (
					<MobileSearchResults searchString={searchString} smartSearch={smartSearch} variant={sr === 2 ? 'cards' : 'list'} previewLines={previewLines} />
				)
			) : null}
		</Box>
	)

	// ---- docked search: buttonless field with a primary gradient border

	const handmadeSearch = (
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

	const search =
		sf === 2 ? (
			<Box sx={{ boxShadow: 2, borderRadius: '0.6rem' }}>
				<MainSearchInput gradientBorder value={searchInputValue} onChange={onSearchValueChange} autoFocus={false} smartSearch={smartSearch} />
			</Box>
		) : (
			handmadeSearch
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
						<Box sx={{ paddingTop: 2, paddingBottom: CONTENT_CLEARANCE }}>{results}</Box>
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
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						...(blueTab
							? { background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }
							: { bgcolor: alpha(theme.palette.background.paper, 0.85), backdropFilter: 'blur(12px)', borderTop: '1px solid', borderColor: 'grey.300' }),
						display: 'flex',
						paddingBottom: 'env(safe-area-inset-bottom)',
						zIndex: 10,
					}}
				>
					<Link to="home" params={{ hledat: undefined }} style={{ flex: 1 }}>
						<TabItem icon={<HomeOutlined />} activeIcon={<HomeRounded />} label={tNav('home')} active blue={blueTab} />
					</Link>
					<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
						<TabItem icon={<LibraryMusicOutlined />} activeIcon={<LibraryMusicRounded />} label={tNav('songs')} blue={blueTab} />
					</Link>
					<Link to={loggedIn ? 'account' : 'login'} params={loggedIn ? {} : { previousPage: '', message: '' }} style={{ flex: 1 }}>
						<TabItem icon={<PersonOutlineRounded />} activeIcon={<PersonRounded />} label={tNav('account')} blue={blueTab} />
					</Link>
				</Box>
			</Box>
		</Box>
	)
}

type TabItemProps = {
	icon: JSX.Element
	activeIcon?: JSX.Element
	label: string
	active?: boolean
	blue?: boolean
}

function TabItem({ icon, activeIcon, label, active, blue }: TabItemProps) {
	const theme = useTheme()
	const color = blue
		? active
			? theme.palette.common.white
			: alpha(theme.palette.common.white, 0.72)
		: active
		? theme.palette.primary.main
		: theme.palette.grey[700]
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, paddingY: 1, color }}>
			{active ? activeIcon ?? icon : icon}
			<Typography small strong={active ? 700 : 400}>
				{label}
			</Typography>
		</Box>
	)
}

/**
 * Variant renderer for the search results so we can compare looks:
 *  - 'cards' — white floating cards, matching the recommended picks
 *  - 'list'  — a quiet title-only list with dividers
 * (variant 'shared' keeps the existing SearchedSongsList; handled by the caller)
 */
function MobileSearchResults({
	searchString,
	smartSearch,
	variant,
	previewLines,
}: {
	searchString: string
	smartSearch: boolean
	variant: 'cards' | 'list'
	previewLines: number
}) {
	const tHome = useTranslations('home')
	const searchSongs = useSongSearch()
	const [songs, setSongs] = useState<SearchSongDto[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let active = true
		setLoading(true)
		searchSongs(searchString as SearchKey, { page: 0, useSmartSearch: smartSearch })
			.then((data) => {
				if (!active) return
				setSongs(data)
				setLoading(false)
			})
			.catch(() => {
				if (!active) return
				setSongs([])
				setLoading(false)
			})
		return () => {
			active = false
		}
	}, [searchString, smartSearch, searchSongs])

	const packs = songs.flatMap((s) => s.found)

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Typography small strong uppercase color="grey.700" sx={{ paddingX: 0.5 }}>
				{tHome('search.resultsTitle').replace(/:$/, '')}
			</Typography>
			{loading ? (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 2, bgcolor: 'grey.200' }} />
					))}
				</Box>
			) : packs.length === 0 ? (
				<Typography color="grey.600">{tHome('search.noResults')}</Typography>
			) : variant === 'cards' ? (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					{packs.map((p) => (
						<SongVariantCard key={p.packGuid} data={p} dense previewLines={previewLines} sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }} />
					))}
				</Box>
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					{packs.map((p) => (
						<Clickable key={p.packGuid}>
							<Link to="variant" params={parseVariantAlias(p.packAlias)}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1.25, borderBottom: '1px solid', borderColor: 'grey.200' }}>
									<Typography strong noWrap sx={{ flex: 1 }}>
										{p.title}
									</Typography>
									<ChevronRightRounded fontSize="small" sx={{ color: 'grey.300' }} />
								</Box>
							</Link>
						</Clickable>
					))}
				</Box>
			)}
		</Box>
	)
}
