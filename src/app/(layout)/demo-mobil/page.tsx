'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import MainSearchInput from '@/app/components/components/MainSearchInput'
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

type DemoVariant = 1 | 2 | 3 | 4

/**
 * The D1 layout (desktop song cards + recent pills + desktop search), made
 * less flat purely with GREY hierarchy — no new colors. Variants tune the
 * shades/depth so surfaces read apart:
 *
 * 1 — bordered: white page, white cards with a hairline border, grey pills
 * 2 — elevated: white page, white cards lifted by a soft shadow, grey pills
 * 3 — grouped: light-grey canvas, white cards for both sections (iOS-like)
 * 4 — banded: white page, bordered cards, recent on a full-width grey band
 */
function DemoMobilePage() {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')

	const [query, setQuery] = useState('')

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()
	const rec = recommended.data
	const last = lastAdded.data
	const loading = recommended.isLoading || lastAdded.isLoading

	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant = parsed >= 1 && parsed <= 4 ? (parsed as DemoVariant) : 2

	// grey palette per variant — the only thing that changes
	const greyCanvas = variant === 3
	const pageBg = greyCanvas ? 'grey.100' : 'background.paper'

	// recent shows white cards on a grey surface in the grouped/banded looks
	const recentWhiteCards = variant === 3 || variant === 4

	// white song card that lifts off the surface via border and/or shadow
	const cardSx =
		variant === 1 || variant === 4
			? { bgcolor: 'background.paper', border: '1px solid', borderColor: 'grey.200', boxShadow: 'none' as const }
			: { bgcolor: 'background.paper', boxShadow: 1 }

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
						sx={{ width: 42, height: 42, borderRadius: 10, bgcolor: greyCanvas ? 'background.paper' : 'grey.100', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: greyCanvas ? 1 : 0 }}
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

	const skeletons = (n: number, h: number) =>
		Array.from({ length: n }).map((_, i) => (
			<Skeleton key={i} variant="rounded" sx={{ height: h, borderRadius: 2, bgcolor: greyCanvas ? 'grey.200' : 'grey.100' }} />
		))

	// ---- picks: dense white song cards -------------------------------

	const picks = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? skeletons(4, 56)
					: rec.slice(0, 5).map((s) => <SongVariantCard key={s.packGuid} data={s} dense sx={cardSx} />)}
			</Box>
		</Box>
	)

	// ---- recent: grey pills (or white cards in the grouped variant) --

	const recent = (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 1.5,
				// banded variant puts recent on a full-width grey strip
				...(variant === 4 && { bgcolor: 'grey.100', paddingY: 2.5 }),
			}}
		>
			<Box sx={{ paddingX: 2.5 }}>{label(tHome('lastAdded.title'))}</Box>
			<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? skeletons(4, 48)
					: recentWhiteCards
					? last.slice(0, 5).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense properties={['SHOW_PUBLISHED_DATE']} sx={cardSx} />
					  ))
					: last.slice(0, 5).map((s) => <RowSongPackCard key={s.packGuid} data={s} />)}
			</Box>
		</Box>
	)

	// ---- search: the real desktop MainSearchInput --------------------

	const search = (
		<MainSearchInput gradientBorder={false} value={query} onChange={setQuery} autoFocus={false} />
	)

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
					bgcolor: pageBg,
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
					position: 'relative',
				}}
			>
				{header}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: CONTENT_CLEARANCE }}>
					{picks}
					{recent}
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
					<Link to="demoMobile" params={{ v }} style={{ flex: 1 }}>
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
