'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { TextField } from '@/common/ui/TextField'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
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
 * Grey canvas + white cards for the picks; the recent section is the quiet
 * airy list (subtle M1 look). The SEARCH is buttonless with a primary
 * gradient border (desktop MainSearchInput look). The top of the page is a
 * soft WHITE → grey wash that reaches down INTO the (intact) picks section and
 * fades out behind the cards — no hard line dividing the section. Variants
 * tune how deep the white reaches and how gentle the fade is:
 *
 * 1 — fades out behind the first card (default)
 * 2 — reaches deeper, fades behind the second card
 * 3 — shorter, whiter — ends higher, just into the first card
 * 4 — very soft, long wash over the whole top
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

	const navigate = useSmartNavigate()
	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant = parsed >= 1 && parsed <= 4 ? (parsed as DemoVariant) : 1

	const submit = () => query.trim() && navigate('home', { hledat: query.trim() })

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

	// ---- picks: one section (label + cards) as before ----------------

	const picks = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 2, bgcolor: 'grey.200' }} />
					  ))
					: rec.slice(0, 5).map((s) => (
							<SongVariantCard key={s.packGuid} data={s} dense sx={{ bgcolor: 'background.paper', boxShadow: 1 }} />
					  ))}
			</Box>
		</Box>
	)

	// ---- recent: kept quiet so it recedes ----------------------------

	const dateOf = (publishedAt?: Date | null) => (publishedAt ? getSmartDateAgoString(publishedAt) : '')

	const recentInner = (() => {
		if (loading) {
			return Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} variant="rounded" sx={{ height: 32, borderRadius: 1, bgcolor: 'grey.200' }} />
			))
		}

		// quiet airy list (M1): dark-grey titles + muted date + faint chevron
		return (
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
	})()

	const recent = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(tHome('lastAdded.title'))}
			{recentInner}
		</Box>
	)

	// ---- search: no button, primary gradient border draws the eye ----

	const search = (
		<Box
			component="form"
			onSubmit={(e) => {
				e.preventDefault()
				submit()
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
					<TextField value={query} onChange={setQuery} placeholder={tSearch('searchByTitleOrText')} />
				</Box>
			</Box>
		</Box>
	)

	// ---- white → grey wash: reaches into the picks section, no hard line

	const heroWhite = theme.palette.common.white
	const heroGrey = theme.palette.grey[100]
	// how deep the white reaches (px) + where the fade begins/ends (%)
	const bgHeight = variant === 2 ? 360 : variant === 3 ? 220 : variant === 4 ? 400 : 280
	const solidStop = variant === 4 ? 25 : variant === 3 ? 55 : variant === 2 ? 45 : 50
	const greyStop = variant === 3 ? 92 : variant === 4 ? 100 : variant === 2 ? 85 : 80
	const heroBg = `linear-gradient(to bottom, ${heroWhite} 0%, ${heroWhite} ${solidStop}%, ${heroGrey} ${greyStop}%)`

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
					// the grey canvas that white cards float on
					bgcolor: 'grey.100',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
					position: 'relative',
				}}
			>
				{/* white → grey wash behind the top; fades out inside the picks section */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: `calc(env(safe-area-inset-top) + ${bgHeight}px)`,
						background: heroBg,
						zIndex: 0,
						pointerEvents: 'none',
					}}
				/>
				<Box sx={{ position: 'relative', zIndex: 1 }}>
					{header}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2, paddingBottom: CONTENT_CLEARANCE }}>
						{picks}
						{recent}
					</Box>
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
