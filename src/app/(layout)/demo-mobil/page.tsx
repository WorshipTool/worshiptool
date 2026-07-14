'use client'

import AllListPanel from '@/app/components/components/AllListPanel/AllListPanel'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import MainSearchInput from '@/app/components/components/MainSearchInput'
import RecommendedSongsList from '@/app/components/components/RecommendedSongsList/RecommendedSongsList'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import RowSongPackCard from '@/common/components/song/RowSongPackCard'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { useSmartParams } from '@/routes/useSmartParams'
import {
	HomeOutlined,
	HomeRounded,
	LibraryMusicOutlined,
	LibraryMusicRounded,
	LoginRounded,
	PersonOutlineRounded,
	PersonRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'

export default SmartPage(DemoMobilePage, [
	'hideToolbar',
	'hideFooter',
	'hideTitle',
	'fullWidth',
	'hidePadding',
])

const PAGE_MAX_WIDTH = 480
const TOOLBAR_SPACER = '56px' // sticky TopBar spacer height (Toolbar.tsx)
const TAB_BAR = 'calc(env(safe-area-inset-bottom) + 64px)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 176px)'

type DemoVariant = 1 | 2 | 3 | 4 | 5

/**
 * The agreed mobile layout (greeting header, picks + recent sections,
 * docked search, tab bar) but built from the REAL desktop components so it
 * feels like the same app. Variants differ in which desktop components /
 * densities are used:
 *
 * 1 — dense song cards (SongVariantCard dense) + recent pills, desktop search
 * 2 — full song cards (SongVariantCard) + recent pills, desktop search
 * 3 — the actual RecommendedSongsList + AllListPanel + recent pills
 * 4 — song cards for both picks and recent (uniform), grey elevated search
 * 5 — dense cards + recent pills, desktop search with the gradient border
 */
function DemoMobilePage() {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')
	const tSearch = useTranslations('search')

	const [query, setQuery] = useState('')

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const rec = recommended.data
	const last = lastAdded.data
	const loading = recommended.isLoading || lastAdded.isLoading

	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant = parsed >= 1 && parsed <= 5 ? (parsed as DemoVariant) : 1

	// ---- header ------------------------------------------------------

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
			<Clickable tooltip={tNav('login')}>
				<Link to="login" params={{ previousPage: '', message: '' }}>
					<Box
						aria-label={tNav('login')}
						sx={{ width: 42, height: 42, borderRadius: 10, bgcolor: 'grey.100', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					>
						<LoginRounded fontSize="small" />
					</Box>
				</Link>
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

	const cardSkeletons = (n: number, h: number) =>
		Array.from({ length: n }).map((_, i) => (
			<Skeleton key={i} variant="rounded" sx={{ height: h, borderRadius: 2, bgcolor: 'grey.200' }} />
		))

	// ---- picks section (desktop song cards) --------------------------

	const picksCards = (dense: boolean) => (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? cardSkeletons(4, dense ? 56 : 120)
					: rec.slice(0, dense ? 5 : 4).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense={dense} sx={{ boxShadow: 1 }} />
					  ))}
			</Box>
		</Box>
	)

	// the actual desktop RecommendedSongsList component
	const picksComponent = (
		<Box sx={{ paddingX: 1 }}>
			<RecommendedSongsList listType="list" dense />
		</Box>
	)

	// ---- recent section ----------------------------------------------

	// desktop RowSongPackCard pills
	const recentPills = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('lastAdded.title'))}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading ? cardSkeletons(4, 48) : last.slice(0, 5).map((s) => <RowSongPackCard key={s.packGuid} data={s} />)}
			</Box>
		</Box>
	)

	// desktop song cards for recent too (uniform look)
	const recentCards = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('lastAdded.title'))}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? cardSkeletons(4, 56)
					: last.slice(0, 5).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense properties={['SHOW_PUBLISHED_DATE']} sx={{ boxShadow: 1 }} />
					  ))}
			</Box>
		</Box>
	)

	// ---- search: the real desktop MainSearchInput --------------------

	const desktopSearch = (gradientBorder: boolean) => (
		<MainSearchInput gradientBorder={gradientBorder} value={query} onChange={setQuery} autoFocus={false} />
	)

	// ---- compose body + search per variant ---------------------------

	const body =
		variant === 1 ? (
			<>
				{picksCards(true)}
				{recentPills}
			</>
		) : variant === 2 ? (
			<>
				{picksCards(false)}
				{recentPills}
			</>
		) : variant === 3 ? (
			<>
				{picksComponent}
				{recentPills}
				<Box sx={{ paddingX: 2.5 }}>
					<AllListPanel />
				</Box>
			</>
		) : variant === 4 ? (
			<>
				{picksCards(true)}
				{recentCards}
			</>
		) : (
			<>
				{picksCards(true)}
				{recentPills}
			</>
		)

	const search = desktopSearch(variant === 5)

	return (
		<Box
			sx={{
				width: 0,
				minWidth: '100%',
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
					bgcolor: 'background.paper',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
					position: 'relative',
				}}
			>
				{header}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: CONTENT_CLEARANCE }}>
					{body}
				</Box>

				{/* ===== SEARCH: floating above the tab bar (thumb zone) ===== */}
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
						bgcolor: alpha(theme.palette.background.paper, 0.85),
						backdropFilter: 'blur(12px)',
						borderTop: '1px solid',
						borderColor: 'grey.300',
						display: 'flex',
						paddingBottom: 'env(safe-area-inset-bottom)',
						zIndex: 10,
					}}
				>
					<Link to="demoMobile" params={{ v: undefined }} style={{ flex: 1 }}>
						<TabItem icon={<HomeOutlined />} activeIcon={<HomeRounded />} label={tNav('home')} active />
					</Link>
					<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
						<TabItem icon={<LibraryMusicOutlined />} activeIcon={<LibraryMusicRounded />} label={tNav('songs')} />
					</Link>
					<Link to="account" params={{}} style={{ flex: 1 }}>
						<TabItem icon={<PersonOutlineRounded />} activeIcon={<PersonRounded />} label={tNav('account')} />
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
}

function TabItem({ icon, activeIcon, label, active }: TabItemProps) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, paddingY: 1, color: active ? 'primary.main' : 'grey.700' }}>
			{active ? activeIcon ?? icon : icon}
			<Typography small strong={active ? 700 : 400}>
				{label}
			</Typography>
		</Box>
	)
}
