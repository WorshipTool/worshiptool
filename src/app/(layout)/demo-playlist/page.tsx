'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Button, IconButton, Typography } from '@/common/ui'
import {
	AddRounded,
	ChevronRightRounded,
	DeleteOutlineRounded,
	DragIndicatorRounded,
	MusicNoteRounded,
	RemoveCircleRounded,
	SearchRounded,
	UndoRounded,
	AddCircleRounded,
	CheckCircleRounded,
	PlayArrowRounded,
	MoreHorizRounded,
	ShareRounded,
	EditRounded,
	SwapVertRounded,
	QueueMusicRounded,
	ArrowBackRounded,
	FormatListBulletedRounded,
	SlideshowRounded,
} from '@mui/icons-material'
import { useSearchParams } from 'next/navigation'
import { Fragment, ReactNode } from 'react'

export default SmartPage(DemoPlaylist, ['fullWidth', 'hideFooter', 'hideToolbar'])

type Song = { t: string; a: string; key: string }
const SONGS: Song[] = [
	{ t: '10 000 důvodů', a: 'Matt Redman', key: 'G' },
	{ t: 'Aleluja, aleluja', a: 'Svítání', key: 'D' },
	{ t: 'Hoden je Beránek', a: 'Chvály', key: 'A' },
	{ t: 'Oceány', a: 'Hillsong', key: 'C' },
	{ t: 'Svatý, svatý, svatý', a: 'Worship', key: 'E' },
	{ t: 'Tvá láska nikdy nekončí', a: 'ESPÉ', key: 'D' },
]

const CARD = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const
const DIVIDER_INSET = 6.5

function Divider({ inset = DIVIDER_INSET }: { inset?: number }) {
	return (
		<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: inset }} />
	)
}

function KeyChip({ k }: { k: string }) {
	return (
		<Box
			sx={{
				minWidth: 30,
				height: 26,
				paddingX: 0.75,
				borderRadius: 1.5,
				bgcolor: 'grey.100',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<Typography small strong={600} color="grey.700">
				{k}
			</Typography>
		</Box>
	)
}

function Idx({ i }: { i: number }) {
	return (
		<Typography
			strong={600}
			color="grey.400"
			sx={{ minWidth: 20, textAlign: 'center', flexShrink: 0 }}
		>
			{i + 1}
		</Typography>
	)
}

const ROW_SX = {
	display: 'flex',
	alignItems: 'center',
	gap: 1.5,
	paddingX: 1.75,
	paddingY: 1.25,
} as const

function Title({ s }: { s: Song }) {
	return (
		<Box sx={{ flex: 1, minWidth: 0 }}>
			<Typography strong noWrap>
				{s.t}
			</Typography>
			<Typography small color="grey.600" noWrap>
				{s.a}
			</Typography>
		</Box>
	)
}

function AddPillHeader() {
	return (
		<Button
			color="primary"
			size="small"
			startIcon={<AddRounded />}
			disableUppercase
			sx={{ borderRadius: 999, paddingX: 1.5, whiteSpace: 'nowrap' }}
		>
			Přidat
		</Button>
	)
}

function TextAction({ label, primary }: { label: string; primary?: boolean }) {
	return (
		<Button
			color={primary ? 'primary' : 'grey.700'}
			size="small"
			disableUppercase
			sx={{ borderRadius: 999, paddingX: 1.25, whiteSpace: 'nowrap' }}
		>
			{label}
		</Button>
	)
}

function Shell({
	actions,
	children,
	subtitle,
}: {
	actions?: ReactNode[]
	children: ReactNode
	subtitle?: string
}) {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle={subtitle}
			backTo="account"
			surface="grey.50"
			overlay
			actions={actions}
		>
			{children}
		</MobileAppHeader>
	)
}

// ---------------------------------------------------------------------------
// V1 — VIEW MODE: clean list, tap to open; "Upravit" + "Přidat" in header
function V1() {
	return (
		<Shell subtitle="6 písní" actions={[<TextAction key="e" label="Upravit" />, <AddPillHeader key="a" />]}>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={ROW_SX}>
							<Idx i={i} />
							<Title s={s} />
							<KeyChip k={s.key} />
							<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
						</Box>
						{i < SONGS.length - 1 && <Divider />}
					</Fragment>
				))}
			</Box>
		</Shell>
	)
}

// V2 — EDIT MODE (Material): drag handle left, delete right, dashed add row
function V2() {
	return (
		<Shell
			actions={[
				<IconButton key="u" color="grey.700" alt="Zpět">
					<UndoRounded />
				</IconButton>,
				<TextAction key="d" label="Hotovo" primary />,
			]}
		>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={ROW_SX}>
							<DragIndicatorRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
							<Title s={s} />
							<KeyChip k={s.key} />
							<IconButton color="grey.500" alt="Odebrat">
								<DeleteOutlineRounded />
							</IconButton>
						</Box>
						{i < SONGS.length - 1 && <Divider inset={5.5} />}
					</Fragment>
				))}
			</Box>
			<Box
				sx={{
					marginTop: 1.5,
					borderRadius: 3,
					border: '1.5px dashed',
					borderColor: 'primary.light',
					bgcolor: 'primary.50',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1,
					paddingY: 1.5,
				}}
			>
				<AddRounded sx={{ color: 'primary.main' }} />
				<Typography strong color="primary.main">
					Přidat píseň
				</Typography>
			</Box>
		</Shell>
	)
}

// V3 — EDIT MODE (iOS): red minus-circle left, reorder handle right
function V3() {
	return (
		<Shell actions={[<TextAction key="d" label="Hotovo" primary />]}>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={ROW_SX}>
							<RemoveCircleRounded sx={{ color: '#ff3b30', flexShrink: 0 }} />
							<Title s={s} />
							<KeyChip k={s.key} />
							<DragIndicatorRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
						</Box>
						{i < SONGS.length - 1 && <Divider inset={6.5} />}
					</Fragment>
				))}
			</Box>
			<Box sx={{ ...ROW_SX, marginTop: 1.5, ...CARD }}>
				<AddCircleRounded sx={{ color: 'primary.main', flexShrink: 0 }} />
				<Typography strong color="primary.main">
					Přidat píseň
				</Typography>
			</Box>
		</Shell>
	)
}

// V4 — ADD-SONG SHEET: what "Přidat" opens — search + results with add
function V4() {
	const results = [
		{ t: 'Přijď již, Duchu stvořiteli', a: 'Svítání', added: false },
		{ t: 'Vylej svého Ducha', a: 'Nová píseň', added: true },
		{ t: 'Chválím Tě', a: 'Timothy', added: false },
		{ t: 'Jenom Ty', a: 'Nomads', added: false },
		{ t: 'Sláva na výsostech', a: 'ESPÉ', added: false },
	]
	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				zIndex: 10,
			}}
		>
			<Box
				sx={{
					paddingTop: 'calc(env(safe-area-inset-top) + 14px)',
					paddingX: 2,
					paddingBottom: 1,
					bgcolor: 'grey.50',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1.5 }}>
					<Typography sx={{ flex: 1, fontSize: '1.4rem', fontWeight: 800 }}>
						Přidat píseň
					</Typography>
					<TextAction label="Hotovo" primary />
				</Box>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						bgcolor: 'background.paper',
						borderRadius: 999,
						paddingX: 1.5,
						height: 44,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<SearchRounded sx={{ color: 'grey.500' }} />
					<Typography color="grey.500">Hledat píseň…</Typography>
				</Box>
			</Box>
			<Box sx={{ flex: 1, overflowY: 'auto', paddingX: 2, paddingTop: 1 }}>
				<Box sx={CARD}>
					{results.map((r, i) => (
						<Fragment key={i}>
							<Box sx={ROW_SX}>
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: 2,
										bgcolor: 'grey.100',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									<MusicNoteRounded sx={{ fontSize: 20, color: 'grey.600' }} />
								</Box>
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography strong noWrap>
										{r.t}
									</Typography>
									<Typography small color="grey.600" noWrap>
										{r.a}
									</Typography>
								</Box>
								{r.added ? (
									<CheckCircleRounded sx={{ color: 'success.main', flexShrink: 0 }} />
								) : (
									<AddCircleRounded sx={{ color: 'primary.main', flexShrink: 0 }} />
								)}
							</Box>
							{i < results.length - 1 && <Divider inset={8.5} />}
						</Fragment>
					))}
				</Box>
			</Box>
		</Box>
	)
}

// ===========================================================================
// V5 — ALBUM HERO (Spotify / Apple Music album-page layout)
function V5() {
	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				bgcolor: 'grey.50',
				overflowY: 'auto',
			}}
		>
			{/* hero */}
			<Box
				sx={{
					background: (t) =>
						`linear-gradient(160deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
					paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
					paddingBottom: 3,
					paddingX: 2.5,
					color: 'common.white',
					borderBottomLeftRadius: 24,
					borderBottomRightRadius: 24,
				}}
			>
				<Box sx={{ display: 'flex', marginBottom: 2 }}>
					<ArrowBackRounded sx={{ color: 'common.white' }} />
				</Box>
				<Box
					sx={{
						width: 92,
						height: 92,
						borderRadius: 3,
						bgcolor: 'rgba(255,255,255,0.16)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 1.5,
					}}
				>
					<QueueMusicRounded sx={{ fontSize: 48, color: 'common.white' }} />
				</Box>
				<Typography sx={{ fontSize: '1.7rem', fontWeight: 800, color: 'inherit' }}>
					Nedělní chvály
				</Typography>
				<Typography sx={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
					6 písní · ~24 min
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Box
						sx={{
							flex: 1,
							bgcolor: 'common.white',
							color: 'primary.main',
							borderRadius: 999,
							height: 48,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 0.5,
							boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
						}}
					>
						<SlideshowRounded />
						<Typography strong color="primary.main">
							Prezentovat
						</Typography>
					</Box>
					{[EditRounded, ShareRounded, MoreHorizRounded].map((Icon, i) => (
						<Box
							key={i}
							sx={{
								width: 48,
								height: 48,
								borderRadius: '50%',
								bgcolor: 'rgba(255,255,255,0.18)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Icon sx={{ color: 'common.white' }} />
						</Box>
					))}
				</Box>
			</Box>
			{/* track list */}
			<Box sx={{ paddingX: 2, paddingTop: 2, paddingBottom: 12 }}>
				<Box sx={CARD}>
					{SONGS.map((s, i) => (
						<Fragment key={i}>
							<Box sx={ROW_SX}>
								<Idx i={i} />
								<Title s={s} />
								<KeyChip k={s.key} />
							</Box>
							{i < SONGS.length - 1 && <Divider />}
						</Fragment>
					))}
				</Box>
			</Box>
		</Box>
	)
}

// ===========================================================================
// V6 — SEGMENTED MODES (Písně / Pořadí / Info). Shown: "Pořadí" (reorder).
function Segment({ items, active }: { items: string[]; active: number }) {
	return (
		<Box
			sx={{
				display: 'flex',
				gap: 0.5,
				bgcolor: 'grey.200',
				borderRadius: 2.5,
				padding: 0.5,
			}}
		>
			{items.map((o, i) => (
				<Box
					key={o}
					sx={{
						flex: 1,
						textAlign: 'center',
						paddingY: 0.75,
						borderRadius: 2,
						bgcolor: active === i ? 'background.paper' : 'transparent',
						boxShadow: active === i ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
					}}
				>
					<Typography small strong={600} color={active === i ? 'grey.900' : 'grey.600'}>
						{o}
					</Typography>
				</Box>
			))}
		</Box>
	)
}

function V6() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			backTo="account"
			surface="grey.50"
			overlay
			controlPanel={<Segment items={['Písně', 'Pořadí', 'Info']} active={1} />}
			actions={[
				<IconButton key="m" color="grey.700" alt="Více">
					<MoreHorizRounded />
				</IconButton>,
			]}
		>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={ROW_SX}>
							<DragIndicatorRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
							<Idx i={i} />
							<Title s={s} />
							<KeyChip k={s.key} />
						</Box>
						{i < SONGS.length - 1 && <Divider inset={8.5} />}
					</Fragment>
				))}
			</Box>
			<Box sx={{ ...ROW_SX, marginTop: 1.5, ...CARD, justifyContent: 'center' }}>
				<AddRounded sx={{ color: 'primary.main' }} />
				<Typography strong color="primary.main">
					Přidat píseň
				</Typography>
			</Box>
		</MobileAppHeader>
	)
}

// ===========================================================================
// V7 — FLOATING EDIT TOOLBAR (persistent bottom actions, no mode switch)
function V7() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle="6 písní"
			backTo="account"
			surface="grey.50"
			overlay
		>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={ROW_SX}>
							<Idx i={i} />
							<Title s={s} />
							<KeyChip k={s.key} />
							<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
						</Box>
						{i < SONGS.length - 1 && <Divider />}
					</Fragment>
				))}
			</Box>
			{/* floating action toolbar */}
			<Box
				sx={{
					position: 'fixed',
					bottom: 'calc(env(safe-area-inset-bottom) + 96px)',
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: 1,
					bgcolor: 'background.paper',
					borderRadius: 999,
					boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
					paddingX: 1,
					paddingY: 0.75,
					zIndex: 20,
				}}
			>
				{[
					{ icon: <AddRounded />, label: 'Přidat', primary: true },
					{ icon: <SwapVertRounded />, label: 'Pořadí' },
					{ icon: <DeleteOutlineRounded />, label: 'Odebrat' },
				].map((b, i) => (
					<Box
						key={i}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							paddingX: 1.5,
							paddingY: 0.75,
							borderRadius: 999,
							bgcolor: b.primary ? 'primary.main' : 'transparent',
							color: b.primary ? 'common.white' : 'grey.700',
						}}
					>
						{b.icon}
						<Typography small strong color={b.primary ? 'common.white' : 'grey.700'}>
							{b.label}
						</Typography>
					</Box>
				))}
			</Box>
		</MobileAppHeader>
	)
}

// ===========================================================================
// V8 — SWIPEABLE SONG DECK (performer / setlist view, one song at a time)
function V8() {
	const cur = SONGS[2]
	return (
		<Box sx={{ position: 'fixed', inset: 0, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
					paddingX: 2,
					paddingBottom: 1,
				}}
			>
				<ArrowBackRounded sx={{ color: 'grey.800' }} />
				<Box sx={{ flex: 1, textAlign: 'center' }}>
					<Typography strong noWrap>
						Nedělní chvály
					</Typography>
					<Typography small color="grey.500">
						3 / 6
					</Typography>
				</Box>
				<FormatListBulletedRounded sx={{ color: 'grey.800' }} />
			</Box>
			{/* current song card (with peek of next) */}
			<Box sx={{ flex: 1, display: 'flex', alignItems: 'stretch', paddingY: 1, position: 'relative', overflow: 'hidden' }}>
				<Box
					sx={{
						flex: 1,
						marginLeft: 2,
						marginRight: 1,
						bgcolor: 'background.paper',
						borderRadius: 4,
						boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
						padding: 3,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
						<Typography sx={{ fontSize: '1.5rem', fontWeight: 800, flex: 1 }}>
							{cur.t}
						</Typography>
						<KeyChip k={cur.key} />
					</Box>
					{['[A] Hoden je Beránek', 'co byl zabit,', '[D] přijmi slávu,', 'čest i chválu.', '', '[E] Svatý, svatý Pán,', 'Bůh všemohoucí…'].map((l, i) => (
						<Typography key={i} sx={{ fontSize: '1.05rem', lineHeight: 1.7, color: l.startsWith('[') ? 'grey.900' : 'grey.800' }}>
							{l || ' '}
						</Typography>
					))}
				</Box>
				{/* peek of next card */}
				<Box
					sx={{
						width: 14,
						marginRight: 0,
						bgcolor: 'background.paper',
						borderTopLeftRadius: 16,
						borderBottomLeftRadius: 16,
						opacity: 0.6,
						boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
					}}
				/>
			</Box>
			{/* position dots + controls */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1.5,
					paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
					paddingTop: 1,
				}}
			>
				<Box sx={{ display: 'flex', gap: 0.75 }}>
					{SONGS.map((_, i) => (
						<Box
							key={i}
							sx={{
								width: i === 2 ? 22 : 7,
								height: 7,
								borderRadius: 999,
								bgcolor: i === 2 ? 'primary.main' : 'grey.300',
							}}
						/>
					))}
				</Box>
				<Typography small color="grey.500">
					Přejeď pro další píseň
				</Typography>
			</Box>
		</Box>
	)
}

function DemoPlaylist() {
	const v = Number(useSearchParams().get('v') || 1)
	if (v === 2) return <V2 />
	if (v === 3) return <V3 />
	if (v === 4) return <V4 />
	if (v === 5) return <V5 />
	if (v === 6) return <V6 />
	if (v === 7) return <V7 />
	if (v === 8) return <V8 />
	return <V1 />
}
