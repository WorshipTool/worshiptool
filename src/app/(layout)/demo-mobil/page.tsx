'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Divider, Image, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { TextField } from '@/common/ui/TextField'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
	ArrowForwardRounded,
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
import { ReactNode, useState } from 'react'
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
const TAB_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 84px)'
const DOCKED_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 172px)'

type DemoVariant = 1 | 2 | 3 | 4 | 5

/**
 * Five structurally different landing concepts (not recolors), all inside
 * the same native shell (bottom tab bar):
 *
 * 1 — shelves: Spotify-style greeting + horizontal shelves of square art
 * 2 — grid: colorful mood-tile grid (big rounded cards)
 * 3 — editorial: a "song of the day" hero + compact idea list
 * 4 — chat: conversational assistant with suggestion chips + compose bar
 * 5 — index: utilitarian sticky-search list, dense and fast
 */
function DemoMobilePage() {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')
	const tSearch = useTranslations('search')
	const tDemo = useTranslations('demo')

	const navigate = useSmartNavigate()
	const [query, setQuery] = useState('')

	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant =
		parsed >= 1 && parsed <= 5 ? (parsed as DemoVariant) : 1

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

	// ---- shared bits -------------------------------------------------

	const searchField = (
		<>
			<SearchRounded sx={{ color: 'grey.600' }} />
			<TextField
				value={query}
				onChange={setQuery}
				placeholder={tSearch('searchByTitleOrText')}
			/>
		</>
	)

	const searchPill = (
		<Box
			sx={{ background: gradient, padding: '2px', borderRadius: 10, boxShadow: 3 }}
		>
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
				{searchField}
			</Box>
		</Box>
	)

	const loginCircle = (
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
	)

	const greeting = (
		<Box>
			<Typography small color="grey.700">
				{tHome('hero.lead')}
			</Typography>
			<Typography variant="h3" strong={800}>
				{tHome('hero.title')}
			</Typography>
		</Box>
	)

	const label = (text: string, action?: ReactNode) => (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 1,
				paddingX: 0.5,
			}}
		>
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

	// ---- variant 1: Spotify-style shelves ----------------------------

	const shelfTile = (s: BasicVariantPack, i: number) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box sx={{ width: 132, display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Box
						sx={{
							width: 132,
							height: 132,
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
	)

	const shelf = (title: string, songs: BasicVariantPack[], offset = 0) => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			<Box sx={{ paddingX: 2.5 }}>{label(title, browseAction)}</Box>
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
							<Skeleton
								key={i}
								variant="rounded"
								sx={{ minWidth: 132, height: 164, borderRadius: 3, bgcolor: 'grey.200' }}
							/>
					  ))
					: songs.slice(0, 8).map((s, i) => shelfTile(s, i + offset))}
			</Box>
		</Box>
	)

	const shelvesVariant = (
		<>
			<Box sx={{ paddingX: 2.5, paddingTop: 3, paddingBottom: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
					{greeting}
					{loginCircle}
				</Box>
				{searchPill}
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingBottom: TAB_CLEARANCE }}>
				{shelf(tHome('recommended.idea'), rec)}
				{shelf(tHome('lastAdded.title'), last, 2)}
			</Box>
		</>
	)

	// ---- variant 2: colorful mood grid -------------------------------

	const gridTile = (s: BasicVariantPack, i: number) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						height: 150,
						borderRadius: 3,
						background: artFor(i),
						color: 'common.white',
						padding: 1.75,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						boxShadow: 1,
					}}
				>
					<Box
						sx={{
							width: 34,
							height: 34,
							borderRadius: 2,
							bgcolor: alpha(theme.palette.common.white, 0.25),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<MusicNoteRounded fontSize="small" />
					</Box>
					<Typography strong>{s.title}</Typography>
				</Box>
			</Link>
		</Clickable>
	)

	const gridVariant = (
		<>
			<Box sx={{ paddingX: 2.5, paddingTop: 3, paddingBottom: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
					{greeting}
					{loginCircle}
				</Box>
				{searchPill}
			</Box>
			<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, paddingBottom: TAB_CLEARANCE }}>
				{label(tHome('recommended.idea'))}
				<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
					{loading
						? Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} variant="rounded" sx={{ height: 150, borderRadius: 3, bgcolor: 'grey.200' }} />
						  ))
						: rec.slice(0, 6).map((s, i) => gridTile(s, i))}
				</Box>
			</Box>
		</>
	)

	// ---- variant 3: editorial "song of the day" ----------------------

	const feature = rec[0]
	const editorialVariant = (
		<>
			<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
				{greeting}
				{loginCircle}
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: DOCKED_CLEARANCE }}>
				<Box sx={{ paddingX: 2.5 }}>
					{loading || !feature ? (
						<Skeleton variant="rounded" sx={{ height: 220, borderRadius: 4, bgcolor: 'grey.200' }} />
					) : (
						<Clickable>
							<Link to="variant" params={parseVariantAlias(feature.packAlias)}>
								<Box
									sx={{
										height: 220,
										borderRadius: 4,
										background: gradient,
										color: 'common.white',
										padding: 3,
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										boxShadow: 3,
									}}
								>
									<Typography small strong uppercase sx={{ opacity: 0.85 }}>
										{tDemo('songOfDay')}
									</Typography>
									<Box>
										<Typography variant="h4" strong={800}>
											{feature.title}
										</Typography>
										<Typography sx={{ opacity: 0.9 }} noWrap>
											{firstLine(feature.sheetData)}
										</Typography>
									</Box>
								</Box>
							</Link>
						</Clickable>
					)}
				</Box>

				<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
					{label(tDemo('moreIdeas'), browseAction)}
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						{loading
							? Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 2, bgcolor: 'grey.200', mb: 1 }} />
							  ))
							: rec.slice(1, 6).map((s, i, arr) => (
									<Box key={s.packGuid}>
										<Clickable>
											<Link to="variant" params={parseVariantAlias(s.packAlias)}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1.25 }}>
													<Box
														sx={{
															width: 44,
															height: 44,
															borderRadius: 2,
															background: artFor(i + 1),
															color: 'common.white',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															flexShrink: 0,
														}}
													>
														<MusicNoteRounded fontSize="small" />
													</Box>
													<Box sx={{ minWidth: 0, flex: 1 }}>
														<Typography strong noWrap>
															{s.title}
														</Typography>
														<Typography small color="grey.700" noWrap>
															{firstLine(s.sheetData)}
														</Typography>
													</Box>
													<ChevronRightRounded sx={{ color: 'grey.500' }} />
												</Box>
											</Link>
										</Clickable>
										{i < arr.length - 1 && <Divider />}
									</Box>
							  ))}
					</Box>
				</Box>
			</Box>
			<DockedSearch>{searchPill}</DockedSearch>
		</>
	)

	// ---- variant 4: chat assistant -----------------------------------

	const chatChip = (s: BasicVariantPack) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: 'grey.300',
						borderRadius: 10,
						paddingX: 2,
						paddingY: 1,
					}}
				>
					<Typography small strong noWrap>
						{s.title}
					</Typography>
				</Box>
			</Link>
		</Clickable>
	)

	const bubble = (children: ReactNode) => (
		<Box
			sx={{
				alignSelf: 'flex-start',
				maxWidth: '85%',
				bgcolor: 'grey.100',
				borderRadius: '4px 18px 18px 18px',
				paddingX: 2,
				paddingY: 1.25,
			}}
		>
			{children}
		</Box>
	)

	const chatVariant = (
		<>
			<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
				{greeting}
				{loginCircle}
			</Box>
			<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: DOCKED_CLEARANCE }}>
				<Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: 10,
							bgcolor: 'grey.100',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
						}}
					>
						<Image src={getAssetUrl('/sheeps/ovce3.svg')} alt="" width={26} height={26} />
					</Box>
					{bubble(<Typography>{tDemo('assistantGreeting')}</Typography>)}
				</Box>

				{bubble(
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Typography small color="grey.700">
							{tDemo('tryChips')}
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{loading
								? Array.from({ length: 4 }).map((_, i) => (
										<Skeleton key={i} variant="rounded" sx={{ width: 120, height: 34, borderRadius: 10, bgcolor: 'grey.200' }} />
								  ))
								: rec.slice(0, 5).map((s) => chatChip(s))}
						</Box>
					</Box>
				)}

				{bubble(
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Typography small color="grey.700">
							{tHome('lastAdded.title')}
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{!loading && last.slice(0, 4).map((s) => chatChip(s))}
						</Box>
					</Box>
				)}
			</Box>

			<DockedSearch>
				<Box
					component="form"
					onSubmit={submitSearch}
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							bgcolor: 'background.paper',
							border: '1px solid',
							borderColor: 'grey.300',
							borderRadius: 10,
							paddingX: 2,
							paddingY: 1.5,
							boxShadow: 2,
						}}
					>
						{searchField}
					</Box>
					<Box
						role="button"
						aria-label={tSearch('searchByTitleOrText')}
						onClick={() => query.trim() && navigate('home', { hledat: query.trim() })}
						sx={{
							width: 48,
							height: 48,
							borderRadius: 10,
							background: gradient,
							color: 'common.white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
							boxShadow: 3,
						}}
					>
						<ArrowForwardRounded />
					</Box>
				</Box>
			</DockedSearch>
		</>
	)

	// ---- variant 5: utilitarian index --------------------------------

	const indexList = (() => {
		const seen = new Set<string>()
		return [...rec, ...last].filter((s) => {
			if (seen.has(s.packGuid)) return false
			seen.add(s.packGuid)
			return true
		})
	})()

	const indexVariant = (
		<>
			<Box
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 5,
					bgcolor: 'background.paper',
					paddingX: 2.5,
					paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
					paddingBottom: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					borderBottom: '1px solid',
					borderColor: 'grey.200',
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
					{greeting}
					{loginCircle}
				</Box>
				<Box
					component="form"
					onSubmit={submitSearch}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						bgcolor: 'grey.100',
						borderRadius: 3,
						paddingX: 2,
						paddingY: 1.5,
					}}
				>
					{searchField}
				</Box>
			</Box>

			<Box sx={{ paddingTop: 1.5, paddingBottom: TAB_CLEARANCE }}>
				<Box sx={{ paddingX: 2.5, paddingBottom: 0.5 }}>{label(tDemo('browseAll'))}</Box>
				{loading
					? Array.from({ length: 8 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 44, borderRadius: 1, bgcolor: 'grey.200', mx: 2.5, mb: 1 }} />
					  ))
					: indexList.slice(0, 14).map((s, i, arr) => (
							<Box key={s.packGuid} sx={{ paddingX: 2.5 }}>
								<Clickable>
									<Link to="variant" params={parseVariantAlias(s.packAlias)}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1.25 }}>
											<Typography strong sx={{ flex: 1 }} noWrap>
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
							</Box>
					  ))}
			</Box>
		</>
	)

	// ------------------------------------------------------------------

	const body =
		variant === 1
			? shelvesVariant
			: variant === 2
			? gridVariant
			: variant === 3
			? editorialVariant
			: variant === 4
			? chatVariant
			: indexVariant

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
				{body}

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
