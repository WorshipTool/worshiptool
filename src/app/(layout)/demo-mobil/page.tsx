'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Divider, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
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
	MusicNoteRounded,
	PersonOutlineRounded,
	PersonRounded,
	SearchRounded,
} from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode, useState } from 'react'
import { BasicVariantPack } from '../../../api/dtos'

export default SmartPage(DemoMobilePage, [
	'hideToolbar',
	'hideFooter',
	'hideTitle',
	'fullWidth',
	'hidePadding',
])

const PAGE_MAX_WIDTH = 480
const TOOLBAR_SPACER = '56px' // sticky TopBar spacer height (Toolbar.tsx)
const DOCKED_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 172px)'

type DemoVariant = 1 | 2 | 3 | 4

/**
 * One fixed recipe: docked search at the bottom, a CLEAN recommended list
 * ("Nějaký nápad") and a COLORFUL "Poslední přidané" section. The variants
 * differ only in how colorful the last-added section is:
 *
 * 1 — carousel: horizontal square gradient cover tiles
 * 2 — thumb rows: colorful thumbnail rows (two-line clean recommended)
 * 3 — grid: colorful two-column gradient tiles
 * 4 — wide cards: horizontal wide gradient cards with title + first line
 */
function DemoMobilePage() {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')
	const tSearch = useTranslations('search')

	const navigate = useSmartNavigate()
	const [query, setQuery] = useState('')

	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant =
		parsed >= 1 && parsed <= 4 ? (parsed as DemoVariant) : 1

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const p = theme.palette
	const gradient = `linear-gradient(135deg, ${p.primary.main}, ${p.primary.dark})`

	// deterministic "cover art" gradients derived from palette tokens
	const artGradients = [
		`linear-gradient(135deg, ${p.primary.main}, ${p.primary.dark})`,
		`linear-gradient(135deg, ${p.info.main}, ${p.primary.main})`,
		`linear-gradient(135deg, ${p.success.main}, ${p.info.main})`,
		`linear-gradient(135deg, ${p.secondary.main}, ${p.warning.main})`,
		`linear-gradient(135deg, ${p.primary.dark}, ${p.error.main})`,
	]
	const artFor = (i: number) => artGradients[i % artGradients.length]

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length > 0) navigate('home', { hledat: query.trim() })
	}

	const firstLine = (sheetData: string) => {
		try {
			return (
				new Sheet(sheetData)
					.getSections()[0]
					?.text?.split('\n')
					.find((l) => l.trim().length > 0) ?? ''
			)
		} catch {
			return ''
		}
	}

	const rec = recommended.data
	const last = lastAdded.data
	const loading = recommended.isLoading || lastAdded.isLoading

	const twoLineRecommended = variant === 2

	// ---- shared bits -------------------------------------------------

	const searchPill = (
		<Box sx={{ background: gradient, padding: '2px', borderRadius: 10, boxShadow: 3 }}>
			<Box
				component="form"
				onSubmit={submitSearch}
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					bgcolor: 'background.paper',
					borderRadius: 10,
					paddingX: 2,
					paddingY: 1.5,
				}}
			>
				<SearchRounded sx={{ color: 'grey.600' }} />
				<TextField value={query} onChange={setQuery} placeholder={tSearch('searchByTitleOrText')} />
			</Box>
		</Box>
	)

	const header = (
		<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
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
						sx={{
							width: 42,
							height: 42,
							borderRadius: 10,
							bgcolor: 'grey.100',
							color: 'primary.main',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
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

	const artThumb = (i: number, size: number) => (
		<Box
			sx={{
				width: size,
				height: size,
				borderRadius: 2,
				background: artFor(i),
				color: 'common.white',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<MusicNoteRounded fontSize="small" />
		</Box>
	)

	// ---- CLEAN recommended list (white, no color) --------------------

	const cleanRecommended = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{loading
					? Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: twoLineRecommended ? 52 : 40, borderRadius: 2, bgcolor: 'grey.200', mb: 1 }} />
					  ))
					: rec.slice(0, 5).map((s, i, arr) => (
							<Fragment key={s.packGuid}>
								<Clickable>
									<Link to="variant" params={parseVariantAlias(s.packAlias)}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: twoLineRecommended ? 1.25 : 1.5 }}>
											<Box sx={{ minWidth: 0, flex: 1 }}>
												<Typography strong noWrap>
													{s.title}
												</Typography>
												{twoLineRecommended && (
													<Typography small color="grey.700" noWrap>
														{firstLine(s.sheetData)}
													</Typography>
												)}
											</Box>
											<ChevronRightRounded sx={{ color: 'grey.400' }} />
										</Box>
									</Link>
								</Clickable>
								{i < arr.length - 1 && <Divider />}
							</Fragment>
					  ))}
			</Box>
		</Box>
	)

	// ---- COLORFUL last-added section (four treatments) ---------------

	const lastLabel = (
		<Box sx={{ paddingX: 2.5 }}>{label(tHome('lastAdded.title'))}</Box>
	)

	// (1) horizontal square cover tiles
	const lastCarousel = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{lastLabel}
			<Box
				sx={{
					display: 'flex',
					gap: 1.5,
					overflowX: 'auto',
					paddingX: 2.5,
					paddingBottom: 0.5,
					scrollSnapType: 'x mandatory',
					'&::-webkit-scrollbar': { display: 'none' },
				}}
			>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ minWidth: 128, height: 160, borderRadius: 3, bgcolor: 'grey.200' }} />
					  ))
					: last.slice(0, 8).map((s, i) => (
							<Clickable key={s.packGuid}>
								<Link to="variant" params={parseVariantAlias(s.packAlias)}>
									<Box sx={{ width: 128, display: 'flex', flexDirection: 'column', gap: 1 }}>
										<Box
											sx={{
												width: 128,
												height: 128,
												borderRadius: 3,
												background: artFor(i),
												color: 'common.white',
												display: 'flex',
												alignItems: 'flex-end',
												padding: 1.25,
												boxShadow: 1,
											}}
										>
											<MusicNoteRounded />
										</Box>
										<Typography strong noWrap sx={{ paddingX: 0.5 }}>
											{s.title}
										</Typography>
									</Box>
								</Link>
							</Clickable>
					  ))}
			</Box>
		</Box>
	)

	// (2) colorful thumbnail rows
	const lastThumbRows = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(tHome('lastAdded.title'))}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 2, bgcolor: 'grey.200', mb: 1 }} />
					  ))
					: last.slice(0, 5).map((s, i, arr) => (
							<Fragment key={s.packGuid}>
								<Clickable>
									<Link to="variant" params={parseVariantAlias(s.packAlias)}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1 }}>
											{artThumb(i, 44)}
											<Typography strong noWrap sx={{ flex: 1 }}>
												{s.title}
											</Typography>
											{s.publishedAt && (
												<Typography small color="grey.500" noWrap>
													{getSmartDateAgoString(s.publishedAt)}
												</Typography>
											)}
											<ChevronRightRounded sx={{ color: 'grey.400' }} />
										</Box>
									</Link>
								</Clickable>
								{i < arr.length - 1 && <Divider />}
							</Fragment>
					  ))}
			</Box>
		</Box>
	)

	// (3) colorful two-column gradient tiles
	const lastGrid = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('lastAdded.title'))}
			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 110, borderRadius: 3, bgcolor: 'grey.200' }} />
					  ))
					: last.slice(0, 6).map((s, i) => (
							<Clickable key={s.packGuid}>
								<Link to="variant" params={parseVariantAlias(s.packAlias)}>
									<Box
										sx={{
											height: 110,
											borderRadius: 3,
											background: artFor(i),
											color: 'common.white',
											padding: 1.5,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											boxShadow: 1,
										}}
									>
										<MusicNoteRounded fontSize="small" />
										<Typography strong noWrap>
											{s.title}
										</Typography>
									</Box>
								</Link>
							</Clickable>
					  ))}
			</Box>
		</Box>
	)

	// (4) horizontal wide gradient cards
	const lastWideCards = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{lastLabel}
			<Box
				sx={{
					display: 'flex',
					gap: 1.5,
					overflowX: 'auto',
					paddingX: 2.5,
					paddingBottom: 0.5,
					scrollSnapType: 'x mandatory',
					'&::-webkit-scrollbar': { display: 'none' },
				}}
			>
				{loading
					? Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ minWidth: 260, height: 104, borderRadius: 3, bgcolor: 'grey.200' }} />
					  ))
					: last.slice(0, 8).map((s, i) => (
							<Clickable key={s.packGuid}>
								<Link to="variant" params={parseVariantAlias(s.packAlias)}>
									<Box
										sx={{
											width: 260,
											height: 104,
											borderRadius: 3,
											background: artFor(i),
											color: 'common.white',
											padding: 2,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											boxShadow: 1,
											scrollSnapAlign: 'start',
										}}
									>
										<Typography strong noWrap>
											{s.title}
										</Typography>
										<Typography small noWrap sx={{ opacity: 0.9 }}>
											{firstLine(s.sheetData)}
										</Typography>
									</Box>
								</Link>
							</Clickable>
					  ))}
			</Box>
		</Box>
	)

	const lastSection =
		variant === 1
			? lastCarousel
			: variant === 2
			? lastThumbRows
			: variant === 3
			? lastGrid
			: lastWideCards

	return (
		<Box
			sx={{
				// width 0 + minWidth 100% stops the column's maxWidth from
				// propagating as min-content through the flex app layout
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
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: DOCKED_CLEARANCE }}>
					{cleanRecommended}
					{lastSection}
				</Box>

				{/* ===== Docked search — floats above the tab bar (thumb zone) ===== */}
				<DockedSearch>{searchPill}</DockedSearch>

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

/** Fixed pill floating above the tab bar (thumb zone). */
function DockedSearch({ children }: { children: ReactNode }) {
	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 'calc(env(safe-area-inset-bottom) + 82px)',
				left: '50%',
				transform: 'translateX(-50%)',
				width: '100%',
				maxWidth: PAGE_MAX_WIDTH,
				paddingX: 4,
				boxSizing: 'border-box',
				zIndex: 10,
			}}
		>
			{children}
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
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 0.25,
				paddingY: 1,
				color: active ? 'primary.main' : 'grey.700',
			}}
		>
			{active ? activeIcon ?? icon : icon}
			<Typography small strong={active ? 700 : 400}>
				{label}
			</Typography>
		</Box>
	)
}
