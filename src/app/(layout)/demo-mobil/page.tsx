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
const TAB_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 84px)'
const DOCKED_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 172px)'

type DemoVariant = 1 | 2 | 3 | 4 | 5

/**
 * Five native list/chat/index landings, all built ONLY from real data
 * (recommended songs, recently added, search, browse-all) — no invented
 * curation features. All share the bottom tab-bar shell.
 *
 * 1 — rich rows: two-line library rows with cover thumbnails, docked search
 * 2 — chat chips: assistant greeting + tappable song suggestion chips
 * 3 — chat list: assistant greeting + a song list inside a wide bubble
 * 4 — dense index: text-only sectioned list, sticky search on top
 * 5 — compact index: one-line thumbnail rows in sections, docked search
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

	const header = (
		<Box
			sx={{
				paddingX: 2.5,
				paddingTop: 3,
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
			{loginCircle}
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

	const thumb = (i: number, size = 44) => (
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

	// one song row; subtitle optional, thumbnail optional
	const songRow = (
		s: BasicVariantPack,
		i: number,
		opts: { subtitle?: string; trailing?: ReactNode; showThumb?: boolean } = {}
	) => (
		<Clickable>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1.25 }}>
					{opts.showThumb && thumb(i)}
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography strong noWrap>
							{s.title}
						</Typography>
						{opts.subtitle && (
							<Typography small color="grey.700" noWrap>
								{opts.subtitle}
							</Typography>
						)}
					</Box>
					{opts.trailing}
					<ChevronRightRounded sx={{ color: 'grey.400' }} />
				</Box>
			</Link>
		</Clickable>
	)

	const rowSkeletons = (n: number, h: number) =>
		Array.from({ length: n }).map((_, i) => (
			<Skeleton
				key={i}
				variant="rounded"
				sx={{ height: h, borderRadius: 2, bgcolor: 'grey.200', mb: 1 }}
			/>
		))

	// a labelled list of song rows (dividers between)
	const listSection = (
		title: string,
		songs: BasicVariantPack[],
		opts: {
			action?: ReactNode
			offset?: number
			showThumb?: boolean
			subtitle?: (s: BasicVariantPack) => string
			trailing?: (s: BasicVariantPack) => ReactNode
			skeletonHeight?: number
			count?: number
		} = {}
	) => (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(title, opts.action)}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{loading
					? rowSkeletons(opts.count ?? 4, opts.skeletonHeight ?? 56)
					: songs.slice(0, opts.count ?? 5).map((s, i, arr) => (
							<Fragment key={s.packGuid}>
								{songRow(s, i + (opts.offset ?? 0), {
									showThumb: opts.showThumb,
									subtitle: opts.subtitle?.(s),
									trailing: opts.trailing?.(s),
								})}
								{i < arr.length - 1 && <Divider />}
							</Fragment>
					  ))}
			</Box>
		</Box>
	)

	const dateChip = (s: BasicVariantPack) =>
		s.publishedAt ? (
			<Typography small color="grey.500" noWrap>
				{getSmartDateAgoString(s.publishedAt)}
			</Typography>
		) : null

	// ---- variant 1: rich two-line rows -------------------------------

	const richVariant = (
		<>
			{header}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: DOCKED_CLEARANCE }}>
				{listSection(tHome('recommended.idea'), rec, {
					action: browseAction,
					showThumb: true,
					subtitle: (s) => firstLine(s.sheetData),
				})}
				{listSection(tHome('lastAdded.title'), last, {
					offset: 2,
					showThumb: true,
					subtitle: (s) => firstLine(s.sheetData),
				})}
			</Box>
			<DockedSearch>{searchPill}</DockedSearch>
		</>
	)

	// ---- variant 2 & 3: chat -----------------------------------------

	const bubble = (children: ReactNode) => (
		<Box
			sx={{
				alignSelf: 'flex-start',
				maxWidth: '88%',
				bgcolor: 'grey.100',
				borderRadius: '4px 18px 18px 18px',
				paddingX: 2,
				paddingY: 1.25,
			}}
		>
			{children}
		</Box>
	)

	const assistantRow = (children: ReactNode) => (
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
			{children}
		</Box>
	)

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

	const composeBar = (
		<DockedSearch>
			<Box component="form" onSubmit={submitSearch} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
	)

	const chatChipsVariant = (
		<>
			{header}
			<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: DOCKED_CLEARANCE }}>
				{assistantRow(bubble(<Typography>{tDemo('assistantGreeting')}</Typography>))}
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
			{composeBar}
		</>
	)

	const chatListVariant = (
		<>
			{header}
			<Box sx={{ paddingX: 2.5, paddingTop: 3, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: DOCKED_CLEARANCE }}>
				{assistantRow(bubble(<Typography>{tDemo('assistantGreeting')}</Typography>))}
				<Box
					sx={{
						alignSelf: 'flex-start',
						width: '92%',
						bgcolor: 'grey.100',
						borderRadius: '4px 18px 18px 18px',
						padding: 1,
					}}
				>
					<Typography small color="grey.700" sx={{ paddingX: 1.5, paddingTop: 0.5 }}>
						{tDemo('tryChips')}
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						{loading
							? rowSkeletons(4, 48)
							: rec.slice(0, 4).map((s, i, arr) => (
									<Fragment key={s.packGuid}>
										<Clickable>
											<Link to="variant" params={parseVariantAlias(s.packAlias)}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, padding: 1.5 }}>
													{thumb(i, 40)}
													<Typography strong noWrap sx={{ flex: 1 }}>
														{s.title}
													</Typography>
													<ChevronRightRounded sx={{ color: 'grey.400' }} />
												</Box>
											</Link>
										</Clickable>
										{i < arr.length - 1 && <Divider sx={{ marginX: 1.5 }} />}
									</Fragment>
							  ))}
					</Box>
				</Box>
			</Box>
			{composeBar}
		</>
	)

	// ---- variant 4: dense text index, sticky search ------------------

	const stickyDenseVariant = (
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
					<Box>
						<Typography small color="grey.700">
							{tHome('hero.lead')}
						</Typography>
						<Typography variant="h3" strong={800}>
							{tHome('hero.title')}
						</Typography>
					</Box>
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
			<Box sx={{ paddingTop: 2, display: 'flex', flexDirection: 'column', gap: 2.5, paddingBottom: TAB_CLEARANCE }}>
				{listSection(tHome('recommended.idea'), rec, {
					action: browseAction,
					count: 5,
					skeletonHeight: 44,
				})}
				{listSection(tHome('lastAdded.title'), last, {
					offset: 2,
					count: 5,
					skeletonHeight: 44,
					trailing: dateChip,
				})}
			</Box>
		</>
	)

	// ---- variant 5: compact thumbnail index, docked search -----------

	const compactVariant = (
		<>
			{header}
			<Box sx={{ paddingTop: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, paddingBottom: DOCKED_CLEARANCE }}>
				{listSection(tHome('recommended.idea'), rec, {
					action: browseAction,
					showThumb: true,
					count: 5,
					skeletonHeight: 48,
				})}
				{listSection(tHome('lastAdded.title'), last, {
					offset: 2,
					showThumb: true,
					count: 5,
					skeletonHeight: 48,
					trailing: dateChip,
				})}
			</Box>
			<DockedSearch>{searchPill}</DockedSearch>
		</>
	)

	// ------------------------------------------------------------------

	const body =
		variant === 1
			? richVariant
			: variant === 2
			? chatChipsVariant
			: variant === 3
			? chatListVariant
			: variant === 4
			? stickyDenseVariant
			: compactVariant

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
