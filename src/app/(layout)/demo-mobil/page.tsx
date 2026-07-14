'use client'

import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Divider, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { TextField } from '@/common/ui/TextField'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
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
import { Sheet } from '@pepavlin/sheet-api'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode, useState } from 'react'

export default SmartPage(DemoMobilePage, [
	'hideToolbar',
	'hideFooter',
	'hideTitle',
	'fullWidth',
	'hidePadding',
])

const PAGE_MAX_WIDTH = 480
const TOOLBAR_SPACER = '56px' // sticky TopBar spacer height (Toolbar.tsx)

// bottom layout metrics (kept in sync so nothing hides / crowds)
const TAB_BAR = 'calc(env(safe-area-inset-bottom) + 64px)'
const CONNECTED_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 148px)'

type DemoVariant = 1 | 2 | 3 | 4 | 5

/**
 * The picked recipe (clean two-line picks + colorful recent rows) with a
 * grey square search field, no button. The variants only tune the field's
 * DROP SHADOW / elevation so it pops and pulls attention:
 *
 * 1 — soft: subtle lift
 * 2 — medium: clearly elevated (default)
 * 3 — strong: prominent float
 * 4 — brand glow: primary-tinted shadow
 * 5 — floating: detached grey field over a transparent bar
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
	// soft-square connected search (2) is the closest to the picked look
	const variant: DemoVariant =
		parsed >= 1 && parsed <= 5 ? (parsed as DemoVariant) : 2

	const recommended = useRecommendedSongs()

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
	const loading = recommended.isLoading

	// all variants use the connected square search bar; they differ only in
	// the field's corner sharpness / fill / accent
	const contentClearance = CONNECTED_CLEARANCE

	// ---- header ------------------------------------------------------

	const header = (
		<Box
			sx={{
				paddingX: 2.5,
				// clear the device status bar (time/battery) + breathing room
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


	// ---- body sections (consistent geometry) -------------------------

	// clean two-line picks — no color, hairline dividers
	const recommendedSection = (
		<Box sx={{ paddingX: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{loading
					? Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" sx={{ height: 52, borderRadius: 2, bgcolor: 'grey.200', mb: 1 }} />
					  ))
					: rec.slice(0, 5).map((s, i, arr) => (
							<Fragment key={s.packGuid}>
								<Clickable>
									<Link to="variant" params={parseVariantAlias(s.packAlias)}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingY: 1.25 }}>
											<Box sx={{ minWidth: 0, flex: 1 }}>
												<Typography strong noWrap>
													{s.title}
												</Typography>
												<Typography small color="grey.700" noWrap>
													{firstLine(s.sheetData)}
												</Typography>
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

	// ---- search treatments -------------------------------------------

	const textInput = (
		<TextField value={query} onChange={setQuery} placeholder={tSearch('searchByTitleOrText')} />
	)
	const plainIcon = <SearchRounded sx={{ color: 'grey.600' }} />

	// Grey square search field, no button — the variants tune the DROP
	// SHADOW / elevation so the field pops and pulls attention.
	const shadow = {
		// 1 — soft: subtle lift
		1: '0px 2px 6px rgba(0,0,0,0.10)',
		// 2 — medium: clearly elevated (default)
		2: '0px 4px 14px rgba(0,0,0,0.15)',
		// 3 — strong: prominent float
		3: '0px 8px 22px rgba(0,0,0,0.20)',
		// 4 — brand glow: primary-tinted shadow draws the eye
		4: `0px 6px 18px ${alpha(theme.palette.primary.main, 0.4)}`,
		// 5 — floating: detached grey field over a transparent bar (see wrapper)
		5: '0px 10px 26px rgba(0,0,0,0.22)',
	}[variant]

	// variant 5 detaches the field: the wrapper below goes transparent so
	// the grey field floats above the tab bar as its own elevated element
	const floatingField = variant === 5

	const squareField = () => (
		<Box
			component="form"
			onSubmit={submitSearch}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				bgcolor: 'grey.100',
				borderRadius: 2.5,
				paddingX: 2,
				paddingY: 1.75,
				boxShadow: shadow,
			}}
		>
			{plainIcon}
			{textInput}
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
					position: 'relative',
				}}
			>
				{header}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2.5, paddingBottom: contentClearance }}>
					{recommendedSection}
				</Box>

				{/* ===== SEARCH: grey elevated field above the tab bar ===== */}
				<Box
					sx={{
						position: 'fixed',
						bottom: TAB_BAR,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						// floating variant: transparent so the field detaches;
						// others: a connected blurred bar joined to the tab bar
						...(floatingField
							? { paddingX: 2.5, paddingBottom: 1.5 }
							: {
									bgcolor: alpha(theme.palette.background.paper, 0.85),
									backdropFilter: 'blur(12px)',
									borderTop: '1px solid',
									borderColor: 'grey.200',
									paddingX: 2.5,
									paddingY: 1.25,
							  }),
						boxSizing: 'border-box',
						zIndex: 10,
					}}
				>
					{squareField()}
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
