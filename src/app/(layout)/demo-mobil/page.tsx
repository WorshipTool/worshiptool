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
const BOTTOM_NAV_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 84px)'

type DemoVariant = 1 | 2 | 3

/**
 * Three internally consistent design systems, all sharing the same page
 * anatomy (header → search → sections → CTA → tab bar). The rule everywhere:
 * saturated color is reserved for the two focus elements (search, CTA) and
 * the active tab; content sections stay calm and uniform.
 *
 * 1 — cards on grey: grey canvas, every section is the same white card,
 *     search pops via gradient border + shadow
 * 2 — gradient hero: search lives inside the brand header, sections are
 *     identical grey panels on white
 * 3 — blue system: white canvas, one accent (primary), tonal panels and
 *     icon-badged section headers, M3-style tab pills
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
	const variant: DemoVariant = Number(v) === 2 ? 2 : Number(v) === 3 ? 3 : 1

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const gradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
	const primaryTint = alpha(theme.palette.primary.main, 0.06)

	// Section content panels — identical within each variant
	const panelBg =
		variant === 1
			? 'background.paper'
			: variant === 2
			? 'grey.100'
			: primaryTint
	const panelShadow = variant === 1 ? 1 : 0
	const rowsHaveDividers = variant === 1
	const rowBg = variant === 1 ? 'transparent' : 'background.paper'
	const tileBg = variant === 1 ? 'grey.100' : 'background.paper'

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length > 0) {
			navigate('home', { hledat: query.trim() })
		}
	}

	const searchInner = (
		<>
			<SearchRounded
				sx={{ color: variant === 3 ? 'primary.main' : 'grey.600' }}
			/>
			<TextField
				value={query}
				onChange={setQuery}
				placeholder={tSearch('searchByTitleOrText')}
			/>
		</>
	)

	const loginLink = (textColor: string) => (
		<Clickable>
			<Link to="login" params={{ previousPage: '', message: '' }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						color: textColor,
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

	const heroTexts = (leadColor?: string) => (
		<Box>
			<Typography small color={leadColor} sx={leadColor ? {} : { opacity: 0.85 }}>
				{tHome('hero.lead')}
			</Typography>
			<Typography variant="h3" strong={800}>
				{tHome('hero.title')}
			</Typography>
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
				width: 28,
				height: 28,
				borderRadius: 1.5,
				bgcolor: alpha(theme.palette.primary.main, 0.12),
				color: 'primary.main',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{icon}
		</Box>
	)

	// Shared section anatomy: header (title + optional action) + content panel
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
	}) => {
		const header = (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 1,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{variant === 3 && sectionBadge(icon)}
					<Typography variant="h6" strong>
						{title}
					</Typography>
				</Box>
				{action}
			</Box>
		)

		if (variant === 3) {
			return (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
						paddingX: 2.5,
					}}
				>
					{header}
					<Box
						sx={{
							bgcolor: panelBg,
							borderRadius: 3,
							padding: 1.5,
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
						}}
					>
						{children}
					</Box>
				</Box>
			)
		}

		return (
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
					{header}
					{children}
				</Box>
			</Box>
		)
	}

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
							bgcolor: alpha(theme.palette.primary.main, 0.12),
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
					bgcolor: variant === 1 ? 'grey.100' : 'background.paper',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				{/* ===================== HEADER + SEARCH ===================== */}
				{variant === 2 ? (
					<Box
						sx={{
							background: gradient,
							color: 'common.white',
							paddingX: 2.5,
							paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
							paddingBottom: 3.5,
							borderRadius: '0 0 28px 28px',
							position: 'relative',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							gap: 2.5,
						}}
					>
						<Box
							sx={{
								position: 'absolute',
								right: 16,
								top: 'calc(env(safe-area-inset-top) + 52px)',
								pointerEvents: 'none',
								opacity: 0.95,
							}}
						>
							{sheep(72)}
						</Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'start',
							}}
						>
							{heroTexts()}
							{loginLink('common.white')}
						</Box>
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
								boxShadow: 2,
							}}
						>
							{searchInner}
						</Box>
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
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'end',
							}}
						>
							{heroTexts('grey.700')}
							{loginLink('primary.main')}
						</Box>

						{variant === 1 ? (
							// gradient border + shadow make the search the strongest element
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
						) : (
							// tonal filled field — the only saturated icon on the page
							<Box
								component="form"
								onSubmit={submitSearch}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									bgcolor: alpha(theme.palette.primary.main, 0.08),
									borderRadius: 10,
									paddingX: 2,
									paddingY: 1.5,
								}}
							>
								{searchInner}
							</Box>
						)}
					</Box>
				)}

				{/* ===================== SECTIONS ===================== */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						gap: 2.5,
						paddingTop: 2.5,
						paddingBottom: BOTTOM_NAV_CLEARANCE,
					}}
				>
					<Section
						title={tHome('recommended.idea')}
						icon={<AutoAwesomeRounded sx={{ fontSize: 18 }} />}
					>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: rowsHaveDividers ? 0 : 1 }}>
							{recommended.isLoading
								? listSkeletons
								: recommended.data.slice(0, 4).map((s, i, arr) => (
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
								marginX: variant === 3 ? -1.5 : -2,
								paddingLeft: variant === 3 ? 1.5 : 2,
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

					{/* ===================== CTA ===================== */}
					{variant === 3 ? (
						<Box sx={{ paddingX: 2.5 }}>
							<Box
								sx={{
									bgcolor: panelBg,
									borderRadius: 3,
									padding: 2.5,
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
										right: 12,
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
							pill={variant === 3}
						/>
					</Link>
					<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
						<TabItem
							icon={<QueueMusicRounded />}
							label={tNav('songs')}
							pill={variant === 3}
						/>
					</Link>
					<Link to="account" params={{}} style={{ flex: 1 }}>
						<TabItem
							icon={<PersonOutlineRounded />}
							label={tNav('account')}
							pill={variant === 3}
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
							? alpha(theme.palette.primary.main, 0.14)
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
