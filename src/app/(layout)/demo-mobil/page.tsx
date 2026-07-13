'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import {
	Box,
	Button,
	Clickable,
	Divider,
	Image,
	Typography,
	useTheme,
} from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { alpha } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { TextField } from '@/common/ui/TextField'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
	AutoAwesomeRounded,
	HomeRounded,
	LoginRounded,
	MusicNoteRounded,
	PersonOutlineRounded,
	QueueMusicRounded,
	ScheduleRounded,
	SearchRounded,
} from '@mui/icons-material'
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
const TAB_BAR_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 84px)'
const DOCKED_SEARCH_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 172px)'

type DemoVariant = 1 | 2 | 3 | 4 | 5

/**
 * Variants — all share the "cards" language, they differ in where the
 * search lives and in the accent system:
 *
 * 1 — search top (baseline): grey canvas, white section cards, gradient
 *     border makes the search the strongest element
 * 2 — search docked at the very bottom above the tab bar (thumb zone),
 *     otherwise identical to 1
 * 3 — search mid-screen: hero fills the upper half, trimmed content
 *     below (no last-added), otherwise the style of 1
 * 4 — polished blue system: white canvas, neutral grey panels, blue used
 *     only as accent (badges, actions, button, tab pill); search docked
 *     bottom with a solid blue border
 * 5 — Google-style minimal: an almost empty white page with just the
 *     brand, the search and one quiet action in the middle
 */
function DemoMobilePage() {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const tNav = useTranslations('navigation')
	const tSearch = useTranslations('search')
	const tSuggestions = useTranslations('suggestions')

	const navigate = useSmartNavigate()
	const [query, setQuery] = useState('')

	const { v } = useSmartParams('demoMobile')
	const parsed = Number(v)
	const variant: DemoVariant =
		parsed >= 2 && parsed <= 5 ? (parsed as DemoVariant) : 1

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const gradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`

	const blueSystem = variant === 4
	const googleMinimal = variant === 5
	const searchDocked = variant === 2 || variant === 4
	const searchCentered = variant === 3
	const showLastAdded = !searchCentered && !googleMinimal

	// One card language per variant: v1–v3 white cards on grey canvas,
	// v4 neutral grey panels on white canvas with blue accents only
	const canvasBg =
		blueSystem || googleMinimal ? 'background.paper' : 'grey.100'
	const panelBg = blueSystem ? 'grey.100' : 'background.paper'
	const panelShadow = blueSystem ? 0 : 1
	const rowsHaveDividers = !blueSystem
	const rowBg = blueSystem ? 'background.paper' : 'transparent'
	const tileBg = blueSystem ? 'background.paper' : 'grey.100'

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length > 0) {
			navigate('home', { hledat: query.trim() })
		}
	}

	const searchInner = (
		<>
			<SearchRounded
				sx={{ color: blueSystem ? 'primary.main' : 'grey.600' }}
			/>
			<TextField
				value={query}
				onChange={setQuery}
				placeholder={tSearch('searchByTitleOrText')}
			/>
		</>
	)

	// v1–v3: gradient border + shadow make the search the strongest element
	// v4: solid blue border keeps the single-accent system
	const searchForm = blueSystem ? (
		<Box
			component="form"
			onSubmit={submitSearch}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				bgcolor: 'background.paper',
				border: '2px solid',
				borderColor: 'primary.main',
				borderRadius: 10,
				paddingX: 2,
				paddingY: 1.5,
				boxShadow: 3,
			}}
		>
			{searchInner}
		</Box>
	) : (
		<Box
			sx={{
				background: gradient,
				padding: '2px',
				borderRadius: 10,
				boxShadow: 3,
			}}
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
				{searchInner}
			</Box>
		</Box>
	)

	const loginLink = (
		<Clickable>
			<Link to="login" params={{ previousPage: '', message: '' }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						color: 'primary.main',
						paddingY: 0.5,
					}}
				>
					<Typography small strong uppercase>
						{tNav('login')}
					</Typography>
					<LoginRounded fontSize="small" />
				</Box>
			</Link>
		</Clickable>
	)

	const sheep = (size: number) => (
		<Image
			src={getAssetUrl('/sheeps/ovce3.svg')}
			alt={tSuggestions('sheep')}
			width={size}
			height={size}
		/>
	)

	const headerRow = (
		<Box
			sx={{
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
			{loginLink}
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

	const sectionBadge = (icon: ReactNode) => (
		<Box
			sx={{
				width: 32,
				height: 32,
				borderRadius: 2,
				bgcolor: alpha(theme.palette.primary.main, 0.1),
				color: 'primary.main',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{icon}
		</Box>
	)

	// Shared section anatomy: panel with header (badge in v4 + title +
	// optional action) and content — identical geometry in every variant
	const Section = ({
		title,
		icon,
		action,
		children,
	}: {
		title: string
		icon: ReactNode
		action?: ReactNode
		children: ReactNode
	}) => (
		<Box sx={{ paddingX: 2.5 }}>
			<Box
				sx={{
					bgcolor: panelBg,
					borderRadius: 3,
					boxShadow: panelShadow,
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 1,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
						{blueSystem && sectionBadge(icon)}
						<Typography variant="h6" strong>
							{title}
						</Typography>
					</Box>
					{action}
				</Box>
				{children}
			</Box>
		</Box>
	)

	const carouselTile = (s: BasicVariantPack) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						width: 164,
						bgcolor: tileBg,
						borderRadius: 2,
						padding: 2,
						scrollSnapAlign: 'start',
						display: 'flex',
						flexDirection: 'column',
						gap: 0.75,
					}}
				>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: 1.5,
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							color: 'primary.main',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 0.75,
						}}
					>
						<MusicNoteRounded fontSize="small" />
					</Box>
					<Typography strong noWrap>
						{s.title}
					</Typography>
					{s.publishedAt && (
						<Typography small color="grey.700">
							{getSmartDateAgoString(s.publishedAt)}
						</Typography>
					)}
				</Box>
			</Link>
		</Clickable>
	)

	const listSkeletons = Array.from({ length: 4 }).map((_, i) => (
		<Skeleton
			key={i}
			variant="rounded"
			sx={{ height: 60, borderRadius: 2, bgcolor: 'grey.200' }}
		/>
	))

	const carouselSkeletons = Array.from({ length: 3 }).map((_, i) => (
		<Skeleton
			key={i}
			variant="rounded"
			sx={{ minWidth: 164, height: 128, borderRadius: 2, bgcolor: 'grey.200' }}
		/>
	))

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
					bgcolor: canvasBg,
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				{/* ===================== HEADER (+ top/centered search) ===================== */}
				{googleMinimal ? (
					// Google-style: an almost empty page — brand + search in the
					// middle, one quiet action, nothing else
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							paddingX: 4,
							paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
							paddingBottom: TAB_BAR_CLEARANCE,
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							{loginLink}
						</Box>
						<Box sx={{ flex: 0.85 }} />
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 3,
							}}
						>
							{sheep(96)}
							<Box sx={{ textAlign: 'center' }}>
								<Typography small color="grey.700">
									{tHome('hero.lead')}
								</Typography>
								<Typography variant="h3" strong={800}>
									{tHome('hero.title')}
								</Typography>
							</Box>
							<Box sx={{ width: '100%' }}>{searchForm}</Box>
							<Clickable>
								<Link to="songsList" params={{ s: undefined }}>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1,
											bgcolor: 'grey.100',
											borderRadius: 10,
											paddingX: 2.5,
											paddingY: 1,
										}}
									>
										<QueueMusicRounded
											fontSize="small"
											sx={{ color: 'grey.700' }}
										/>
										<Typography small strong>
											{tHome('allList.title')}
										</Typography>
									</Box>
								</Link>
							</Clickable>
						</Box>
						<Box sx={{ flex: 1.15 }} />
					</Box>
				) : searchCentered ? (
					// hero fills the upper half so the search lands mid-screen,
					// inside comfortable thumb reach
					<Box
						sx={{
							paddingX: 2.5,
							paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
							height: '52dvh',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							gap: 2.5,
						}}
					>
						{headerRow}
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								pointerEvents: 'none',
							}}
						>
							{sheep(120)}
						</Box>
						{searchForm}
					</Box>
				) : (
					<Box
						sx={{
							paddingX: 2.5,
							paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
							display: 'flex',
							flexDirection: 'column',
							gap: 2.5,
						}}
					>
						{headerRow}
						{!searchDocked && searchForm}
					</Box>
				)}

				{/* ===================== SECTIONS ===================== */}
				{!googleMinimal && (
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						gap: 2.5,
						paddingTop: 2.5,
						paddingBottom: searchDocked
							? DOCKED_SEARCH_CLEARANCE
							: TAB_BAR_CLEARANCE,
					}}
				>
					<Section
						title={tHome('recommended.idea')}
						icon={<AutoAwesomeRounded sx={{ fontSize: 18 }} />}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: rowsHaveDividers ? 0 : 1,
							}}
						>
							{recommended.isLoading
								? listSkeletons
								: recommended.data
										.slice(0, showLastAdded ? 4 : 6)
										.map((s, i, arr) => (
											<Fragment key={s.packGuid}>
												<SongVariantCard
													data={s}
													dense
													sx={{
														bgcolor: rowBg,
														borderRadius: rowsHaveDividers ? 0 : 2,
													}}
												/>
												{rowsHaveDividers && i < arr.length - 1 && (
													<Divider sx={{ marginX: 1 }} />
												)}
											</Fragment>
										))}
						</Box>
					</Section>

					{showLastAdded && (
						<Section
							title={tHome('lastAdded.title')}
							icon={<ScheduleRounded sx={{ fontSize: 18 }} />}
							action={browseAction}
						>
							<Box
								sx={{
									display: 'flex',
									gap: 1.5,
									overflowX: 'auto',
									// bleed the scroll area to the panel edges, then restore
									// the inset inside it so tiles align with the header text
									marginX: -2,
									paddingLeft: 2,
									paddingY: 0.5,
									scrollSnapType: 'x mandatory',
									scrollPaddingLeft: theme.spacing(2),
									'&::-webkit-scrollbar': { display: 'none' },
									// keeps the right inset visible at the end of the scroll
									// (trailing padding collapses in overflow containers)
									'&::after': {
										content: '""',
										flex: '0 0 1px',
									},
								}}
							>
								{lastAdded.isLoading
									? carouselSkeletons
									: lastAdded.data.slice(0, 8).map((s) => carouselTile(s))}
							</Box>
						</Section>
					)}

					{/* ===================== CTA ===================== */}
					{blueSystem ? (
						<Box sx={{ paddingX: 2.5 }}>
							<Box
								sx={{
									bgcolor: panelBg,
									borderRadius: 3,
									padding: 2,
									display: 'flex',
									flexDirection: 'column',
									gap: 1.5,
									position: 'relative',
								}}
							>
								<Box
									sx={{
										position: 'absolute',
										top: -34,
										right: 16,
										pointerEvents: 'none',
									}}
								>
									{sheep(56)}
								</Box>
								<Box>
									<Typography variant="h6" strong>
										{tSuggestions('noIdea')}
									</Typography>
									<Typography small color="grey.700">
										{tSuggestions('chooseSuggestion')}
									</Typography>
								</Box>
								<Button
									to="songsList"
									toParams={{ s: undefined }}
									size="large"
									startIcon={<QueueMusicRounded />}
								>
									{tHome('allList.title')}
								</Button>
							</Box>
						</Box>
					) : (
						<Box sx={{ paddingX: 2.5 }}>
							<Box
								sx={{
									background: gradient,
									color: 'common.white',
									borderRadius: 3,
									padding: 2.5,
									display: 'flex',
									flexDirection: 'column',
									gap: 1.5,
								}}
							>
								<Box>
									<Typography variant="h6" strong>
										{tSuggestions('noIdea')}
									</Typography>
									<Typography small sx={{ opacity: 0.9 }}>
										{tSuggestions('chooseSuggestion')}
									</Typography>
								</Box>
								<Clickable>
									<Link to="songsList" params={{ s: undefined }}>
										<Box
											sx={{
												bgcolor: 'background.paper',
												color: 'primary.main',
												borderRadius: 2,
												paddingY: 1.5,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: 1,
											}}
										>
											<QueueMusicRounded fontSize="small" />
											<Typography small strong uppercase>
												{tHome('allList.title')}
											</Typography>
										</Box>
									</Link>
								</Clickable>
							</Box>
						</Box>
					)}
				</Box>
				)}

				{/* ===== Docked search — floats above the tab bar (thumb zone) ===== */}
				{searchDocked && (
					<Box
						sx={{
							position: 'fixed',
							bottom: 'calc(env(safe-area-inset-bottom) + 82px)',
							left: '50%',
							transform: 'translateX(-50%)',
							width: '100%',
							maxWidth: PAGE_MAX_WIDTH,
							paddingX: 4,
							// no global border-box in this app — keep the padding
							// inside the 100% width instead of overflowing it
							boxSizing: 'border-box',
							zIndex: 10,
						}}
					>
						{searchForm}
					</Box>
				)}

				{/* ===================== BOTTOM TAB BAR ===================== */}
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						bgcolor: 'background.paper',
						borderTop: '1px solid',
						borderColor: 'grey.300',
						display: 'flex',
						paddingBottom: 'env(safe-area-inset-bottom)',
						zIndex: 10,
					}}
				>
					<Link to="demoMobile" params={{ v }} style={{ flex: 1 }}>
						<TabItem
							icon={<HomeRounded />}
							label={tNav('home')}
							active
							pill={blueSystem}
						/>
					</Link>
					<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
						<TabItem
							icon={<QueueMusicRounded />}
							label={tNav('songs')}
							pill={blueSystem}
						/>
					</Link>
					<Link to="account" params={{}} style={{ flex: 1 }}>
						<TabItem
							icon={<PersonOutlineRounded />}
							label={tNav('account')}
							pill={blueSystem}
						/>
					</Link>
				</Box>
			</Box>
		</Box>
	)
}

type TabItemProps = {
	icon: JSX.Element
	label: string
	active?: boolean
	/** Material-3-like tonal pill behind the active icon */
	pill?: boolean
}

function TabItem({ icon, label, active, pill }: TabItemProps) {
	const theme = useTheme()
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
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					...(pill && {
						paddingX: 2,
						borderRadius: 10,
						bgcolor: active
							? alpha(theme.palette.primary.main, 0.12)
							: 'transparent',
					}),
				}}
			>
				{icon}
			</Box>
			<Typography small strong={active ? 700 : 400}>
				{label}
			</Typography>
		</Box>
	)
}
