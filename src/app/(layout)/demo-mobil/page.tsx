'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import {
	Box,
	Clickable,
	Divider,
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
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
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
const DOCKED_SEARCH_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 172px)'

type DemoVariant = 1 | 2 | 3 | 4
type HeaderStyle = 'white' | 'lightgrey' | 'dark' | 'elevated'

/**
 * One base design (square header, alternating full-bleed band sections,
 * docked gradient search, translucent tab bar). The header color is the
 * experiment — no brand blue up top, it stays in the search and accents:
 *
 * 1 — white: flat white header, dark text
 * 2 — lightgrey: grey.100 header, band order flipped so surfaces alternate
 * 3 — dark: grey.900 header with white text
 * 4 — elevated: white header lifted with a soft shadow (classic app bar)
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

	const gradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`

	const headerStyle: HeaderStyle = (
		['white', 'lightgrey', 'dark', 'elevated'] as const
	)[variant - 1]
	const darkHeader = headerStyle === 'dark'

	// lightgrey header flips the band order so adjacent surfaces alternate
	const recommendedSurface: 'white' | 'grey' =
		headerStyle === 'lightgrey' ? 'white' : 'grey'
	const lastAddedSurface: 'white' | 'grey' =
		headerStyle === 'lightgrey' ? 'grey' : 'white'

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length > 0) {
			navigate('home', { hledat: query.trim() })
		}
	}

	// gradient border + shadow keep the search the strongest element
	const searchForm = (
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
				<SearchRounded sx={{ color: 'grey.600' }} />
				<TextField
					value={query}
					onChange={setQuery}
					placeholder={tSearch('searchByTitleOrText')}
				/>
			</Box>
		</Box>
	)

	// circular icon button reads more native than an uppercase text link
	const loginButton = (
		<Clickable tooltip={tNav('login')}>
			<Link to="login" params={{ previousPage: '', message: '' }}>
				<Box
					aria-label={tNav('login')}
					sx={{
						width: 42,
						height: 42,
						borderRadius: 10,
						bgcolor: darkHeader
							? alpha(theme.palette.common.white, 0.16)
							: headerStyle === 'lightgrey'
							? 'background.paper'
							: 'grey.100',
						color: darkHeader ? 'common.white' : 'primary.main',
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

	const sectionLabel = (title: string, action?: ReactNode) => (
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
				{title.replace(/:$/, '')}
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

	// full-bleed band section
	const Section = ({
		title,
		action,
		surface,
		children,
	}: {
		title: string
		action?: ReactNode
		surface: 'white' | 'grey'
		children: ReactNode
	}) => (
		<Box
			sx={{
				bgcolor: surface === 'grey' ? 'grey.100' : 'background.paper',
				paddingY: 2.5,
				paddingX: 2.5,
				display: 'flex',
				flexDirection: 'column',
				gap: 1.5,
			}}
		>
			{sectionLabel(title, action)}
			{children}
		</Box>
	)

	const carouselTile = (s: BasicVariantPack, bg: string) => (
		<Clickable key={s.packGuid}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						width: 164,
						bgcolor: bg,
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

	const listSkeletons = Array.from({ length: 5 }).map((_, i) => (
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

	// carousel bleeds to the section edge; the inset matches its padding
	const carouselBleed = 2.5

	const recommendedRows = (
		<Box sx={{ display: 'flex', flexDirection: 'column' }}>
			{recommended.isLoading
				? listSkeletons
				: recommended.data.slice(0, 5).map((s, i, arr) => (
						<Fragment key={s.packGuid}>
							<SongVariantCard
								data={s}
								dense
								sx={{ bgcolor: 'transparent', borderRadius: 0 }}
							/>
							{i < arr.length - 1 && <Divider sx={{ marginX: 1 }} />}
						</Fragment>
				  ))}
		</Box>
	)

	const lastAddedCarousel = (tilesBg: string) => (
		<Box
			sx={{
				display: 'flex',
				gap: 1.5,
				overflowX: 'auto',
				marginX: -carouselBleed,
				paddingLeft: carouselBleed,
				paddingY: 0.5,
				scrollSnapType: 'x mandatory',
				scrollPaddingLeft: theme.spacing(carouselBleed),
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
				: lastAdded.data.slice(0, 8).map((s) => carouselTile(s, tilesBg))}
		</Box>
	)

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
				}}
			>
				{/* ===================== HEADER ===================== */}
				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
						paddingBottom: 3,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'end',
						...(headerStyle === 'white' && {
							bgcolor: 'background.paper',
						}),
						...(headerStyle === 'lightgrey' && {
							bgcolor: 'grey.100',
						}),
						...(headerStyle === 'dark' && {
							bgcolor: 'grey.900',
							color: 'common.white',
						}),
						...(headerStyle === 'elevated' && {
							bgcolor: 'background.paper',
							boxShadow: 2,
							position: 'relative',
							zIndex: 1,
						}),
					}}
				>
					<Box>
						<Typography
							small
							color={darkHeader ? undefined : 'grey.700'}
							sx={darkHeader ? { opacity: 0.8 } : {}}
						>
							{tHome('hero.lead')}
						</Typography>
						<Typography variant="h3" strong={800}>
							{tHome('hero.title')}
						</Typography>
					</Box>
					{loginButton}
				</Box>

				{/* ===================== SECTIONS ===================== */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						paddingBottom: DOCKED_SEARCH_CLEARANCE,
					}}
				>
					<Section
						title={tHome('recommended.idea')}
						surface={recommendedSurface}
					>
						{recommendedRows}
					</Section>

					<Section
						title={tHome('lastAdded.title')}
						action={browseAction}
						surface={lastAddedSurface}
					>
						{lastAddedCarousel(
							lastAddedSurface === 'white' ? 'grey.100' : 'background.paper'
						)}
					</Section>
				</Box>

				{/* ===== Docked search — floats above the tab bar (thumb zone) ===== */}
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

				{/* ===================== BOTTOM TAB BAR ===================== */}
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						// translucent + blur like native bars
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
						<TabItem
							icon={<HomeOutlined />}
							activeIcon={<HomeRounded />}
							label={tNav('home')}
							active
						/>
					</Link>
					<Link to="songsList" params={{ s: undefined }} style={{ flex: 1 }}>
						<TabItem
							icon={<LibraryMusicOutlined />}
							activeIcon={<LibraryMusicRounded />}
							label={tNav('songs')}
						/>
					</Link>
					<Link to="account" params={{}} style={{ flex: 1 }}>
						<TabItem
							icon={<PersonOutlineRounded />}
							activeIcon={<PersonRounded />}
							label={tNav('account')}
						/>
					</Link>
				</Box>
			</Box>
		</Box>
	)
}

type TabItemProps = {
	icon: JSX.Element
	/** filled counterpart shown when the tab is selected (native pattern) */
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
