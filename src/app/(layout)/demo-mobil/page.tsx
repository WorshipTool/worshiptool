'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import MainSearchInput from '@/app/components/components/MainSearchInput'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { useSmartParams } from '@/routes/useSmartParams'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
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
 * Grey canvas + white cards for the picks (the liked G3 look). The recent
 * section stays QUIET; these variants refine the two liked directions —
 * the airy list and the chips:
 *
 * 1 — airy list with date: spaced muted rows, title + date
 * 2 — airy list, titles only: even cleaner, no dates
 * 3 — chips outlined: small bordered title chips that wrap
 * 4 — chips filled: soft grey filled chips, no border
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
	const variant: DemoVariant = parsed >= 1 && parsed <= 4 ? (parsed as DemoVariant) : 1

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
						sx={{ width: 42, height: 42, borderRadius: 10, bgcolor: 'background.paper', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 1 }}
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

	// ---- picks: white cards on the grey canvas -----------------------

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

		// 3 & 4 — title chips (3 outlined, 4 soft filled)
		if (variant === 3 || variant === 4) {
			const filled = variant === 4
			return (
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{last.slice(0, 6).map((s) => (
						<Clickable key={s.packGuid}>
							<Link to="variant" params={parseVariantAlias(s.packAlias)}>
								<Box
									sx={{
										borderRadius: 10,
										paddingX: 1.75,
										paddingY: 0.75,
										...(filled
											? { bgcolor: 'grey.200' }
											: { border: '1px solid', borderColor: 'grey.300' }),
									}}
								>
									<Typography small color="grey.700" noWrap>
										{s.title}
									</Typography>
								</Box>
							</Link>
						</Clickable>
					))}
				</Box>
			)
		}

		// 1 & 2 — airy transparent rows (1 shows the date, 2 titles only)
		const withDate = variant === 1
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
				{last.slice(0, 5).map((s) => (
					<Clickable key={s.packGuid}>
						<Link to="variant" params={parseVariantAlias(s.packAlias)}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1 }}>
								<Typography color="grey.800" noWrap sx={{ flex: 1 }}>
									{s.title}
								</Typography>
								{withDate && (
									<Typography small color="grey.500" noWrap>
										{dateOf(s.publishedAt)}
									</Typography>
								)}
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

	// ---- search ------------------------------------------------------

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
					// the grey canvas that white cards float on
					bgcolor: 'grey.100',
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
