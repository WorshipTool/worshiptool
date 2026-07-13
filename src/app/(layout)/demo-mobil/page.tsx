'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Divider, Image, Typography, useTheme } from '@/common/ui'
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
	HomeRounded,
	LoginRounded,
	MusicNoteRounded,
	PersonOutlineRounded,
	QueueMusicRounded,
	SearchRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, useState } from 'react'
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

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length > 0) {
			navigate('home', { hledat: query.trim() })
		}
	}

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

	const carouselTile = (s: BasicVariantPack, tileBg: string) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						width: 168,
						bgcolor: tileBg,
						borderRadius: 3,
						padding: 2,
						boxShadow: 1,
						scrollSnapAlign: 'start',
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
					}}
				>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: 2,
							bgcolor: alpha(theme.palette.primary.main, 0.12),
							color: 'primary.main',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
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

	const carouselSkeletons = Array.from({ length: 4 }).map((_, i) => (
		<Skeleton
			key={i}
			variant="rounded"
			sx={{
				minWidth: 168,
				height: 120,
				borderRadius: 3,
				bgcolor: 'grey.200',
			}}
		/>
	))

	const listSkeletons = Array.from({ length: 4 }).map((_, i) => (
		<Skeleton
			key={i}
			variant="rounded"
			sx={{ height: 64, borderRadius: 2, bgcolor: 'grey.200' }}
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
				bgcolor: variant === 2 ? 'grey.200' : 'grey.300',
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
					bgcolor:
						variant === 1 ? 'grey.100' : variant === 2 ? 'background.paper' : 'background.paper',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				{/* ===================== HEADER ===================== */}
				{variant === 1 && (
					<>
						<Box
							sx={{
								background: gradient,
								color: 'common.white',
								paddingX: 2.5,
								paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
								paddingBottom: 8,
								position: 'relative',
								overflow: 'hidden',
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									right: 12,
									bottom: -6,
									transform: 'rotate(-8deg)',
									pointerEvents: 'none',
									opacity: 0.9,
								}}
							>
								{sheep(76)}
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'start',
								}}
							>
								<Box>
									<Typography small sx={{ opacity: 0.85 }}>
										{tHome('hero.lead')}
									</Typography>
									<Typography variant="h4" strong={800}>
										{tHome('hero.title')}
									</Typography>
								</Box>
								{loginLink('common.white')}
							</Box>
						</Box>

						<Box
							component="form"
							onSubmit={submitSearch}
							sx={{
								marginTop: -3.5,
								marginX: 2.5,
								position: 'relative',
								zIndex: 1,
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								bgcolor: 'background.paper',
								borderRadius: 3,
								paddingX: 2,
								paddingY: 1.5,
								boxShadow: 2,
							}}
						>
							{searchField}
						</Box>
					</>
				)}

				{variant === 2 && (
					<Box
						sx={{
							paddingX: 2.5,
							paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
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
							{loginLink('primary.main')}
						</Box>

						<Box
							component="form"
							onSubmit={submitSearch}
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								bgcolor: 'grey.100',
								borderRadius: 10,
								paddingX: 2,
								paddingY: 1.25,
							}}
						>
							{searchField}
						</Box>
					</Box>
				)}

				{variant === 3 && (
					<Box
						sx={{
							bgcolor: 'primary.main',
							color: 'common.white',
							paddingX: 2.5,
							paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
							paddingBottom: 3,
							borderRadius: '0 0 28px 28px',
							position: 'relative',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						<Box
							sx={{
								position: 'absolute',
								right: 10,
								top: 'calc(env(safe-area-inset-top) + 10px)',
								pointerEvents: 'none',
							}}
						>
							{sheep(64)}
						</Box>
						<Box>
							<Typography small sx={{ opacity: 0.85 }}>
								{tHome('hero.lead')}
							</Typography>
							<Typography variant="h4" strong={800}>
								{tHome('hero.title')}
							</Typography>
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
								paddingY: 1.25,
							}}
						>
							{searchField}
						</Box>
					</Box>
				)}

				{/* ===================== CONTENT ===================== */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
						paddingTop: 3,
						paddingBottom: BOTTOM_NAV_CLEARANCE,
					}}
				>
					{/* --- Recommended songs --- */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
							paddingX: 2.5,
						}}
					>
						<Typography variant="h6" strong>
							{tHome('recommended.idea')}
						</Typography>

						{variant === 2 ? (
							<Box
								sx={{
									bgcolor: 'grey.100',
									borderRadius: 3,
									overflow: 'hidden',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{recommended.isLoading
									? listSkeletons
									: recommended.data.slice(0, 4).map((v, i, arr) => (
											<Fragment key={v.packGuid}>
												<SongVariantCard
													data={v}
													dense
													sx={{ bgcolor: 'transparent', borderRadius: 0 }}
												/>
												{i < arr.length - 1 && (
													<Divider sx={{ marginX: 2 }} />
												)}
											</Fragment>
									  ))}
							</Box>
						) : (
							<Box
								sx={{
									...(variant === 3 && {
										bgcolor: alpha(theme.palette.primary.main, 0.07),
										borderRadius: 3,
										padding: 1.5,
									}),
									display: 'flex',
									flexDirection: 'column',
									gap: 1,
								}}
							>
								{recommended.isLoading
									? listSkeletons
									: recommended.data.slice(0, 4).map((v) => (
											<SongVariantCard
												key={v.packGuid}
												data={v}
												dense
												sx={{
													bgcolor: 'background.paper',
													boxShadow: 1,
												}}
											/>
									  ))}
							</Box>
						)}
					</Box>

					{/* --- Last added (horizontal carousel) --- */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
							// full-bleed grey band separates the section from the white page
							...(variant === 2 && {
								bgcolor: 'grey.100',
								paddingY: 2,
							}),
						}}
					>
						<Typography variant="h6" strong sx={{ paddingX: 2.5 }}>
							{tHome('lastAdded.title')}
						</Typography>

						<Box
							sx={{
								...(variant === 3 && {
									bgcolor: alpha(theme.palette.secondary.main, 0.14),
									borderRadius: 3,
									marginX: 2.5,
									paddingX: 1.5,
								}),
							}}
						>
							<Box
								sx={{
									display: 'flex',
									gap: 1.5,
									overflowX: 'auto',
									paddingX: variant === 3 ? 0 : 2.5,
									paddingY: variant === 3 ? 1.5 : 1,
									scrollSnapType: 'x mandatory',
									'&::-webkit-scrollbar': { display: 'none' },
								}}
							>
								{lastAdded.isLoading
									? carouselSkeletons
									: lastAdded.data
											.slice(0, 8)
											.map((s) => carouselTile(s, 'background.paper'))}
							</Box>
						</Box>
					</Box>

					{/* --- CTA: browse all songs --- */}
					{
						<Box
							sx={{
								marginX: 2.5,
								...(variant === 1
									? {
											bgcolor: 'background.paper',
											boxShadow: 1,
									  }
									: {
											background: gradient,
											color: 'common.white',
									  }),
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
								<Typography
									small
									color={variant === 1 ? 'grey.700' : undefined}
									sx={variant === 1 ? {} : { opacity: 0.9 }}
								>
									{tSuggestions('chooseSuggestion')}
								</Typography>
							</Box>
							<Clickable>
								<Link to="songsList" params={{ s: undefined }}>
									<Box
										sx={{
											...(variant === 1
												? {
														background: gradient,
														color: 'common.white',
												  }
												: {
														bgcolor: 'background.paper',
														color: 'primary.main',
												  }),
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
					}
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
