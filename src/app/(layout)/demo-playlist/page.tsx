'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { MOBILE_NAV_CLEARANCE } from '@/common/components/MobileAppTabBar/nav.constants'
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
	PrintRounded,
	TuneRounded,
	KeyboardArrowLeftRounded,
	KeyboardArrowRightRounded,
	CloseRounded,
	VisibilityOffRounded,
} from '@mui/icons-material'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Sheet } from '@pepavlin/sheet-api'
import { useSearchParams } from 'next/navigation'
import { Fragment, ReactNode, useEffect, useMemo, useRef } from 'react'

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
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
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
								<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
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
		<Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: MOBILE_NAV_CLEARANCE, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
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

// ===========================================================================
// MULTISCREEN FLOWS — hero (V5) → tap song → full-song reader you can swipe
// through, with present / print / edit always reachable. The flows differ in
// how the reader is chromed. Shared pieces first.

const LYRICS = [
	'[A] Hoden je Beránek,',
	'co byl zabit,',
	'[D] přijmi slávu,',
	'čest i chválu.',
	'',
	'[E] Svatý, svatý Pán,',
	'Bůh všemohoucí,',
	'[A] který byl a který je,',
	'[D] jenž přichází.',
	'',
	'[A] Aleluja, aleluja,',
	'[E] nebe zpívá,',
	'zástupy Ti chválu vzdávají.',
]

// the current song shown in every reader (Hoden je Beránek, #3 of 6)
function SheetCard({ big }: { big?: boolean }) {
	return (
		<Box sx={{ ...CARD, padding: 3 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
				<Typography sx={{ fontSize: big ? '1.6rem' : '1.4rem', fontWeight: 800, flex: 1 }}>
					{SONGS[2].t}
				</Typography>
				<KeyChip k={SONGS[2].key} />
			</Box>
			{LYRICS.map((l, i) =>
				l ? (
					<Typography
						key={i}
						sx={{
							fontSize: big ? '1.2rem' : '1.05rem',
							lineHeight: 1.7,
							color: l.startsWith('[') ? 'grey.900' : 'grey.800',
						}}
					>
						{l}
					</Typography>
				) : (
					<Box key={i} sx={{ height: 14 }} />
				),
			)}
		</Box>
	)
}

// reader top bar: back to the playlist, centered title + "3 / 6", right slot
function ReaderHead({ right }: { right?: ReactNode }) {
	return (
		<Box
			sx={{
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				gap: 0.5,
				paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
				paddingX: 1.5,
				paddingBottom: 1,
			}}
		>
			<IconButton color="grey.800" alt="Zpět na playlist">
				<ArrowBackRounded />
			</IconButton>
			<Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
				<Typography strong noWrap>
					Nedělní chvály
				</Typography>
				<Typography small color="grey.500">
					3 / 6
				</Typography>
			</Box>
			{right ?? <Box sx={{ width: 40 }} />}
		</Box>
	)
}

// swipe position indicator (grey app surface)
function ReaderDots({ hint = true }: { hint?: boolean }) {
	return (
		<Box
			sx={{
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 0.75,
				paddingTop: 1,
				paddingBottom: 1.5,
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
			{hint && (
				<Typography small color="grey.500">
					Přejeď pro další píseň
				</Typography>
			)}
		</Box>
	)
}

// FLOW A — IMMERSIVE reader: tab bar hides while reading (focus mode, most
// V8-like), actions tucked in a "…" sheet. Back returns to the hero (tab bar).
function ReaderAInner() {
	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				zIndex: 30,
			}}
		>
			<ReaderHead
				right={
					<IconButton color="grey.800" alt="Více">
						<MoreHorizRounded />
					</IconButton>
				}
			/>
			<Box sx={{ flex: 1, overflowY: 'auto', paddingX: 2 }}>
				<SheetCard />
			</Box>
			<ReaderDots />
			<Box sx={{ height: 'env(safe-area-inset-bottom)' }} />
		</Box>
	)
}
function ReaderA() {
	return <ReaderAInner />
}

// FLOW A — the "…" action sheet the reader opens
function ReaderAMenu() {
	const items = [
		{ icon: <SlideshowRounded />, label: 'Prezentovat', primary: true },
		{ icon: <EditRounded />, label: 'Upravit píseň' },
		{ icon: <TuneRounded />, label: 'Transponovat' },
		{ icon: <VisibilityOffRounded />, label: 'Skrýt akordy' },
		{ icon: <PrintRounded />, label: 'Vytisknout playlist' },
		{ icon: <ShareRounded />, label: 'Sdílet' },
	]
	return (
		<>
			<ReaderAInner />
			<Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 35 }} />
			<Box
				sx={{
					position: 'fixed',
					left: 0,
					right: 0,
					bottom: 0,
					bgcolor: 'background.paper',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
					zIndex: 36,
					boxShadow: '0 -8px 30px rgba(0,0,0,0.2)',
				}}
			>
				<Box
					sx={{
						width: 40,
						height: 4,
						borderRadius: 999,
						bgcolor: 'grey.300',
						margin: '8px auto 10px',
					}}
				/>
				{items.map((it, i) => (
					<Box
						key={i}
						sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingX: 2.5, paddingY: 1.5 }}
					>
						<Box sx={{ color: it.primary ? 'primary.main' : 'grey.700', display: 'flex' }}>
							{it.icon}
						</Box>
						<Typography
							strong={it.primary ? 600 : undefined}
							color={it.primary ? 'primary.main' : 'grey.800'}
						>
							{it.label}
						</Typography>
					</Box>
				))}
			</Box>
		</>
	)
}

// FLOW B — reader keeps the tab bar AND a persistent action bar right above it,
// so present / edit / print are always one tap away (no hidden menu).
function ReaderB() {
	const actions = [
		{ icon: <VisibilityOffRounded />, label: 'Akordy' },
		{ icon: <TuneRounded />, label: 'Tón' },
		{ icon: <EditRounded />, label: 'Upravit' },
		{ icon: <PrintRounded />, label: 'Tisk' },
		{ icon: <SlideshowRounded />, label: 'Prezentovat', primary: true },
	]
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<ReaderHead
				right={
					<IconButton color="grey.800" alt="Seznam písní">
						<FormatListBulletedRounded />
					</IconButton>
				}
			/>
			<Box sx={{ flex: 1, overflowY: 'auto', paddingX: 2 }}>
				<SheetCard />
			</Box>
			<ReaderDots hint={false} />
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					bgcolor: 'background.paper',
					borderTop: '1px solid',
					borderColor: 'grey.200',
					paddingY: 0.75,
					paddingX: 1,
				}}
			>
				{actions.map((a, i) => (
					<Box
						key={i}
						sx={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 0.25,
							color: a.primary ? 'primary.main' : 'grey.600',
						}}
					>
						{a.icon}
						<Typography
							sx={{ fontSize: '0.7rem' }}
							strong={a.primary ? 600 : undefined}
							color={a.primary ? 'primary.main' : 'grey.600'}
						>
							{a.label}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	)
}

// FLOW C — reader keeps the tab bar and adds a horizontal "setlist rail" up top
// so you can jump straight to any song (not just swipe to neighbours). Actions
// in a compact "…" menu.
function ReaderC() {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<ReaderHead
				right={
					<IconButton color="grey.800" alt="Více">
						<MoreHorizRounded />
					</IconButton>
				}
			/>
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					gap: 1,
					overflowX: 'auto',
					paddingX: 2,
					paddingBottom: 1,
				}}
			>
				{SONGS.map((s, i) => (
					<Box
						key={i}
						sx={{
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							gap: 0.75,
							paddingX: 1.5,
							paddingY: 0.75,
							borderRadius: 999,
							bgcolor: i === 2 ? 'primary.main' : 'background.paper',
							boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
						}}
					>
						<Typography small strong={700} color={i === 2 ? 'common.white' : 'grey.400'}>
							{i + 1}
						</Typography>
						<Typography
							small
							strong={i === 2 ? 600 : 500}
							noWrap
							color={i === 2 ? 'common.white' : 'grey.700'}
							sx={{ maxWidth: 120 }}
						>
							{s.t}
						</Typography>
					</Box>
				))}
			</Box>
			<Box sx={{ flex: 1, overflowY: 'auto', paddingX: 2 }}>
				<SheetCard />
			</Box>
			<ReaderDots />
		</Box>
	)
}

// PRESENT — the full-screen presentation mode "Prezentovat" launches (shared by
// every flow): chromeless dark stage view, big lyrics, tap / arrows to advance.
function PresentScreen() {
	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				bgcolor: 'grey.900',
				display: 'flex',
				flexDirection: 'column',
				zIndex: 40,
				paddingTop: 'calc(env(safe-area-inset-top) + 14px)',
				paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
				paddingX: 3,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
				<CloseRounded sx={{ color: 'rgba(255,255,255,0.7)' }} />
				<Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
					<Typography strong noWrap sx={{ color: 'common.white' }}>
						Hoden je Beránek
					</Typography>
					<Typography small sx={{ color: 'rgba(255,255,255,0.5)' }}>
						3 / 6
					</Typography>
				</Box>
				<Box
					sx={{
						minWidth: 34,
						height: 28,
						paddingX: 0.75,
						borderRadius: 1.5,
						bgcolor: 'rgba(255,255,255,0.14)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography small strong={600} sx={{ color: 'common.white' }}>
						A
					</Typography>
				</Box>
			</Box>
			<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
				{LYRICS.slice(0, 10).map((l, i) =>
					l ? (
						<Typography
							key={i}
							sx={{
								fontSize: '1.55rem',
								lineHeight: 1.6,
								fontWeight: 500,
								color: l.startsWith('[') ? 'rgba(255,255,255,0.55)' : 'common.white',
							}}
						>
							{l}
						</Typography>
					) : (
						<Box key={i} sx={{ height: 18 }} />
					),
				)}
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
				<KeyboardArrowLeftRounded sx={{ color: 'rgba(255,255,255,0.5)' }} />
				<Box sx={{ display: 'flex', gap: 0.75 }}>
					{SONGS.map((_, i) => (
						<Box
							key={i}
							sx={{
								width: i === 2 ? 22 : 7,
								height: 7,
								borderRadius: 999,
								bgcolor: i === 2 ? 'common.white' : 'rgba(255,255,255,0.3)',
							}}
						/>
					))}
				</Box>
				<KeyboardArrowRightRounded sx={{ color: 'rgba(255,255,255,0.5)' }} />
			</Box>
		</Box>
	)
}

// ===========================================================================
// LOOK VARIANTS for the two core screens (the settled behaviour: playlist =
// simple ordered list → tap → lyrics). These explore how each screen could
// *look*, keeping that behaviour. Playlist looks = PL1–PL4, song looks = SNG1–4.

// lyrics split into named sections (for the section-labelled song look)
const SECTIONS: { label: string; lines: string[] }[] = [
	{
		label: 'Sloka 1',
		lines: ['[A] Hoden je Beránek,', 'co byl zabit,', '[D] přijmi slávu,', 'čest i chválu.'],
	},
	{
		label: 'Refrén',
		lines: [
			'[E] Svatý, svatý Pán,',
			'Bůh všemohoucí,',
			'[A] který byl a který je,',
			'[D] jenž přichází.',
		],
	},
	{
		label: 'Sloka 2',
		lines: ['[A] Aleluja, aleluja,', '[E] nebe zpívá,', 'zástupy Ti chválu vzdávají.'],
	},
]

// one lyric line with chord tokens ([A], [D]…) coloured apart from the words
function ChordLine({
	line,
	big,
	accent,
	dense,
}: {
	line: string
	big?: boolean
	accent?: boolean
	dense?: boolean
}) {
	const parts = line.split(/(\[[^\]]+\])/g).filter((p) => p !== '')
	return (
		<Box
			sx={{
				fontSize: big ? '1.2rem' : dense ? '0.98rem' : '1.05rem',
				lineHeight: dense ? 1.4 : 1.7,
			}}
		>
			{parts.map((p, i) => (
				<Box
					key={i}
					component="span"
					sx={{
						color: p.startsWith('[')
							? accent
								? 'primary.main'
								: 'grey.500'
							: 'grey.900',
						fontWeight: p.startsWith('[') ? 700 : 400,
					}}
				>
					{p}
				</Box>
			))}
		</Box>
	)
}

function LyricLines({ big, accent, dense }: { big?: boolean; accent?: boolean; dense?: boolean }) {
	return (
		<>
			{LYRICS.map((l, i) =>
				l ? (
					<ChordLine key={i} line={l} big={big} accent={accent} dense={dense} />
				) : (
					<Box key={i} sx={{ height: dense ? 10 : big ? 18 : 14 }} />
				),
			)}
		</>
	)
}

// header actions shared by the playlist looks: present + overflow (kept as
// icons so the large collapsing title keeps full width)
function PresentAction() {
	return [
		<IconButton key="p" color="primary" alt="Prezentovat">
			<SlideshowRounded />
		</IconButton>,
		<IconButton key="m" color="grey.700" alt="Více">
			<MoreHorizRounded />
		</IconButton>,
	]
}

// PL1 — CLEAN MINIMAL: white page, airy hairline rows, lots of whitespace
function PL1() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle="6 písní · ~24 min"
			backTo="account"
			surface="background.paper"
			overlay
			actions={PresentAction()}
		>
			<Box>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingY: 1.75, paddingX: 0.5 }}>
							<Typography strong={600} color="grey.300" sx={{ fontSize: '1.1rem', minWidth: 22 }}>
								{i + 1}
							</Typography>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography strong noWrap>
									{s.t}
								</Typography>
								<Typography small color="grey.500" noWrap>
									{s.a}
								</Typography>
							</Box>
							<KeyChip k={s.key} />
							<ChevronRightRounded sx={{ color: 'grey.300', flexShrink: 0 }} />
						</Box>
						{i < SONGS.length - 1 && (
							<Box sx={{ height: '1px', bgcolor: 'grey.100', marginLeft: 5 }} />
						)}
					</Fragment>
				))}
			</Box>
		</MobileAppHeader>
	)
}

// PL2 — SETLIST / PROGRAM: big ghosted order numbers, reads like a printed set
function PL2() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle="Neděle · 6 písní"
			backTo="account"
			surface="grey.50"
			overlay
			actions={PresentAction()}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				{SONGS.map((s, i) => (
					<Box
						key={i}
						sx={{ ...CARD, display: 'flex', alignItems: 'center', gap: 2, paddingX: 2, paddingY: 1.5 }}
					>
						<Typography
							sx={{ fontSize: '2rem', fontWeight: 800, color: 'grey.200', lineHeight: 1, minWidth: 42 }}
						>
							{i + 1}
						</Typography>
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography strong noWrap sx={{ fontSize: '1.05rem' }}>
								{s.t}
							</Typography>
							<Typography small color="grey.500" noWrap>
								{s.a}
							</Typography>
						</Box>
						<KeyChip k={s.key} />
					</Box>
				))}
			</Box>
		</MobileAppHeader>
	)
}

// PL3 — RICH CARDS: each song a card with a coloured order tile, more weight
function PL3() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle="6 písní · ~24 min"
			backTo="account"
			surface="grey.50"
			overlay
			actions={PresentAction()}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				{SONGS.map((s, i) => (
					<Box key={i} sx={{ ...CARD, display: 'flex', alignItems: 'center', gap: 1.5, padding: 1.5 }}>
						<Box
							sx={{
								width: 46,
								height: 46,
								borderRadius: 2.5,
								bgcolor: 'primary.50',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
							}}
						>
							<Typography strong={700} color="primary.main" sx={{ fontSize: '1.2rem' }}>
								{i + 1}
							</Typography>
						</Box>
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography strong noWrap>
								{s.t}
							</Typography>
							<Typography small color="grey.500" noWrap>
								{s.a}
							</Typography>
						</Box>
						<KeyChip k={s.key} />
						<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
					</Box>
				))}
			</Box>
		</MobileAppHeader>
	)
}

// PL4 — COMPACT + SUMMARY: stat strip on top, then a dense list (long setlists)
function PL4() {
	const stats: [string, string][] = [
		['6', 'písní'],
		['~24', 'minut'],
		['G–E', 'tóniny'],
	]
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			backTo="account"
			surface="grey.50"
			overlay
			actions={PresentAction()}
		>
			<Box sx={{ display: 'flex', gap: 1, marginBottom: 1.5 }}>
				{stats.map(([n, l], i) => (
					<Box key={i} sx={{ ...CARD, flex: 1, textAlign: 'center', paddingY: 1 }}>
						<Typography strong sx={{ fontSize: '1.05rem' }}>
							{n}
						</Typography>
						<Typography sx={{ fontSize: '0.7rem' }} color="grey.500">
							{l}
						</Typography>
					</Box>
				))}
			</Box>
			<Box sx={CARD}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, paddingX: 1.5, paddingY: 0.9 }}>
							<Typography
								small
								strong={600}
								color="grey.400"
								sx={{ minWidth: 16, textAlign: 'center' }}
							>
								{i + 1}
							</Typography>
							<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>
								{s.t}
							</Typography>
							<Typography small color="grey.500" noWrap sx={{ maxWidth: 90 }}>
								{s.a}
							</Typography>
							<KeyChip k={s.key} />
						</Box>
						{i < SONGS.length - 1 && <Divider inset={5.5} />}
					</Fragment>
				))}
			</Box>
		</MobileAppHeader>
	)
}

// shared shell for the song-look variants: back-to-playlist header + "3/6" + dots
function SongShell({
	surface = 'grey.50',
	hint = true,
	children,
}: {
	surface?: string
	hint?: boolean
	children: ReactNode
}) {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
				bgcolor: surface,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<ReaderHead
				right={
					<IconButton color="grey.800" alt="Více">
						<MoreHorizRounded />
					</IconButton>
				}
			/>
			<Box sx={{ flex: 1, overflowY: 'auto', paddingX: 2 }}>{children}</Box>
			<ReaderDots hint={hint} />
		</Box>
	)
}

// SNG1 — FULL-BLEED WHITE: edge-to-edge reading page, no card, max reading room
function SNG1() {
	return (
		<SongShell surface="background.paper">
			<Typography sx={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 1, marginBottom: 2 }}>
				{SONGS[2].t}
			</Typography>
			<LyricLines />
		</SongShell>
	)
}

// SNG2 — LARGE / RELAXED: bigger type, generous spacing, accent chords
function SNG2() {
	return (
		<SongShell surface="grey.50">
			<Box sx={{ ...CARD, padding: 3 }}>
				<Typography sx={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 2.5, textAlign: 'center' }}>
					{SONGS[2].t}
				</Typography>
				<LyricLines big accent />
			</Box>
		</SongShell>
	)
}

// SNG3 — SECTION-LABELLED: Sloka / Refrén pills, accent chords (musician view)
function SNG3() {
	return (
		<SongShell surface="grey.50">
			<Box sx={{ ...CARD, padding: 3 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
					<Typography sx={{ fontSize: '1.4rem', fontWeight: 800, flex: 1 }}>{SONGS[2].t}</Typography>
					<KeyChip k={SONGS[2].key} />
				</Box>
				{SECTIONS.map((sec, si) => (
					<Box key={si} sx={{ marginBottom: 2.5 }}>
						<Box
							sx={{
								display: 'inline-block',
								bgcolor: 'grey.100',
								borderRadius: 1.5,
								paddingX: 1,
								paddingY: 0.25,
								marginBottom: 0.75,
							}}
						>
							<Typography
								sx={{ fontSize: '0.7rem', letterSpacing: '0.6px' }}
								strong={700}
								color="grey.500"
							>
								{sec.label.toUpperCase()}
							</Typography>
						</Box>
						{sec.lines.map((l, i) => (
							<ChordLine key={i} line={l} accent />
						))}
					</Box>
				))}
			</Box>
		</SongShell>
	)
}

// SNG4 — COMPACT: tight line-height, fits a long song with little scrolling
function SNG4() {
	return (
		<SongShell surface="grey.50" hint={false}>
			<Box sx={{ ...CARD, padding: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
					<Typography strong sx={{ fontSize: '1.15rem', flex: 1 }}>
						{SONGS[2].t}
					</Typography>
					<KeyChip k={SONGS[2].key} />
				</Box>
				<LyricLines dense />
			</Box>
		</SongShell>
	)
}

// ===========================================================================
// HERO-LED PLAYLIST LOOKS — the big, prominent V5 gradient header paired with
// the cleaner list treatments. H1–H3.

// the V5 gradient hero, extracted + parameterisable (bigger / centered)
function GradientHero({ large, center }: { large?: boolean; center?: boolean }) {
	const cover = large ? 116 : 92
	return (
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
			<Box sx={{ display: 'flex', marginBottom: large ? 1.5 : 2 }}>
				<ArrowBackRounded sx={{ color: 'common.white' }} />
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: center ? 'center' : 'flex-start',
					textAlign: center ? 'center' : 'left',
				}}
			>
				<Box
					sx={{
						width: cover,
						height: cover,
						borderRadius: 3,
						bgcolor: 'rgba(255,255,255,0.16)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 1.5,
					}}
				>
					<QueueMusicRounded sx={{ fontSize: large ? 60 : 48, color: 'common.white' }} />
				</Box>
				<Typography sx={{ fontSize: large ? '2.1rem' : '1.7rem', fontWeight: 800, color: 'inherit' }}>
					Nedělní chvály
				</Typography>
				<Typography sx={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
					6 písní · ~24 min
				</Typography>
			</Box>
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
	)
}

function HeroScroll({ children }: { children: ReactNode }) {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
				bgcolor: 'grey.50',
				overflowY: 'auto',
			}}
		>
			{children}
		</Box>
	)
}

// grouped white list (V5-style: one card, hairline rows)
function GroupedList() {
	return (
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
	)
}

// separate rich cards (coloured order tile per song)
function CardList() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
			{SONGS.map((s, i) => (
				<Box key={i} sx={{ ...CARD, display: 'flex', alignItems: 'center', gap: 1.5, padding: 1.5 }}>
					<Box
						sx={{
							width: 46,
							height: 46,
							borderRadius: 2.5,
							bgcolor: 'primary.50',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
						}}
					>
						<Typography strong={700} color="primary.main" sx={{ fontSize: '1.2rem' }}>
							{i + 1}
						</Typography>
					</Box>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography strong noWrap>
							{s.t}
						</Typography>
						<Typography small color="grey.500" noWrap>
							{s.a}
						</Typography>
					</Box>
					<KeyChip k={s.key} />
					<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
				</Box>
			))}
		</Box>
	)
}

// H1 — prominent gradient hero + rich separate cards
function HeroPlA() {
	return (
		<HeroScroll>
			<GradientHero />
			<Box sx={{ paddingX: 2, paddingTop: 2, paddingBottom: 4 }}>
				<CardList />
			</Box>
		</HeroScroll>
	)
}

// H2 — extra-large centered hero + grouped list
function HeroPlB() {
	return (
		<HeroScroll>
			<GradientHero large center />
			<Box sx={{ paddingX: 2, paddingTop: 2, paddingBottom: 4 }}>
				<GroupedList />
			</Box>
		</HeroScroll>
	)
}

// H3 — gradient hero + summary strip + compact dense list
function HeroPlC() {
	const stats: [string, string][] = [
		['6', 'písní'],
		['~24', 'minut'],
		['G–E', 'tóniny'],
	]
	return (
		<HeroScroll>
			<GradientHero />
			<Box sx={{ paddingX: 2, paddingTop: 2, paddingBottom: 4 }}>
				<Box sx={{ display: 'flex', gap: 1, marginBottom: 1.5 }}>
					{stats.map(([n, l], i) => (
						<Box key={i} sx={{ ...CARD, flex: 1, textAlign: 'center', paddingY: 1 }}>
							<Typography strong sx={{ fontSize: '1.05rem' }}>
								{n}
							</Typography>
							<Typography sx={{ fontSize: '0.7rem' }} color="grey.500">
								{l}
							</Typography>
						</Box>
					))}
				</Box>
				<Box sx={CARD}>
					{SONGS.map((s, i) => (
						<Fragment key={i}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, paddingX: 1.5, paddingY: 0.9 }}>
								<Typography small strong={600} color="grey.400" sx={{ minWidth: 16, textAlign: 'center' }}>
									{i + 1}
								</Typography>
								<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>
									{s.t}
								</Typography>
								<Typography small color="grey.500" noWrap sx={{ maxWidth: 90 }}>
									{s.a}
								</Typography>
								<KeyChip k={s.key} />
							</Box>
							{i < SONGS.length - 1 && <Divider inset={5.5} />}
						</Fragment>
					))}
				</Box>
			</Box>
		</HeroScroll>
	)
}

// ===========================================================================
// SONG PREVIEW — the REAL shared SheetDisplay (same component desktop uses),
// dropped onto the white card. This is the target: the song content is shared,
// we only own the card + shell (header, swipe) around it.
const SAMPLE_SHEET = `{Sloka 1}
[A]Hoden je Beránek,
co byl [G]zabit,
[D]přijmi slávu,
čest i [A]chválu.
{Refrén}
[E]Svatý, svatý [A]Pán,
Bůh vše[D]mohoucí,
[A]který byl a [D]který je,
jenž při[E]chází.
{Sloka 2}
[A]Aleluja, ale[E]luja,
nebe [D]zpívá,
[A]zástupy Ti chválu [E]vzdá[A]vají.`

function SongReal() {
	const sheet = useMemo(() => new Sheet(SAMPLE_SHEET), [])
	return (
		<SongShell surface="grey.50">
			<Box sx={{ ...CARD, padding: 2.5 }}>
				<SheetDisplay
					sheet={sheet}
					title="Hoden je Beránek"
					hideChords={false}
					variant="default"
					editMode={false}
				/>
			</Box>
		</SongShell>
	)
}

// ===========================================================================
// COLLAPSING HERO (chosen: H2 big centered hero that compacts on scroll).
// The hero shrinks from a large centered header to a slim gradient bar as the
// list scrolls (imperative rAF, like MobileAppHeader). `demoPhase` forces a
// static state so the two ends can be screenshotted without client scroll.
const HERO_LARGE = 330 // hero height at rest (on top of the safe-area inset)
const HERO_COMPACT = 54 // slim bar height
const HERO_DISTANCE = 170 // scroll distance over which it collapses

function CollapsingHero({
	demoPhase,
	tone = 'gradient',
}: {
	demoPhase?: 'expanded' | 'compact'
	tone?: 'gradient' | 'white' | 'grey'
}) {
	const light = tone !== 'gradient'
	const titleColor = light ? 'grey.900' : 'common.white'
	const metaColor = light ? 'grey.500' : 'rgba(255,255,255,0.8)'
	const backColor = light ? 'grey.800' : 'common.white'
	const coverBg = light ? 'primary.50' : 'rgba(255,255,255,0.16)'
	const coverIcon = light ? 'primary.main' : 'common.white'
	const secBg = light ? 'grey.100' : 'rgba(255,255,255,0.18)'
	const secIcon = light ? 'grey.600' : 'common.white'
	const presentBg = light ? 'primary.main' : 'common.white'
	const presentFg = light ? 'common.white' : 'primary.main'

	const heroRef = useRef<HTMLDivElement>(null)
	const expandedRef = useRef<HTMLDivElement>(null)
	const compactRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const isCompact = demoPhase === 'compact'

	useEffect(() => {
		if (demoPhase) return // static demo state comes from SSR, no scroll wiring
		const scroller = scrollRef.current
		if (!scroller) return
		let raf = 0
		const apply = (p: number) => {
			if (heroRef.current)
				heroRef.current.style.height = `calc(env(safe-area-inset-top) + ${
					HERO_LARGE - (HERO_LARGE - HERO_COMPACT) * p
				}px)`
			if (expandedRef.current)
				expandedRef.current.style.opacity = String(1 - Math.min(1, p * 1.5))
			if (compactRef.current)
				compactRef.current.style.opacity = String(Math.max(0, (p - 0.5) / 0.5))
			if (heroRef.current) {
				const r = `${(1 - p) * 24}px`
				heroRef.current.style.borderBottomLeftRadius = r
				heroRef.current.style.borderBottomRightRadius = r
			}
		}
		const paint = () => {
			raf = 0
			apply(Math.min(1, Math.max(0, scroller.scrollTop / HERO_DISTANCE)))
		}
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(paint)
		}
		scroller.addEventListener('scroll', onScroll, { passive: true })
		apply(0)
		return () => scroller.removeEventListener('scroll', onScroll)
	}, [demoPhase])

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: MOBILE_NAV_CLEARANCE,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			<Box
				ref={heroRef}
				style={{
					height: `calc(env(safe-area-inset-top) + ${isCompact ? HERO_COMPACT : HERO_LARGE}px)`,
					borderBottomLeftRadius: isCompact ? 0 : 24,
					borderBottomRightRadius: isCompact ? 0 : 24,
				}}
				sx={{
					flexShrink: 0,
					position: 'relative',
					overflow: 'hidden',
					boxShadow: light ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
					...(light
						? { bgcolor: tone === 'white' ? 'background.paper' : 'grey.100' }
						: {
								background: (t) =>
									`linear-gradient(160deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
						  }),
				}}
			>
				{/* expanded layer — big centered hero */}
				<Box
					ref={expandedRef}
					style={{ opacity: isCompact ? 0 : 1 }}
					sx={{
						position: 'absolute',
						inset: 0,
						paddingTop: 'calc(env(safe-area-inset-top) + 10px)',
						paddingX: 2.5,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<ArrowBackRounded sx={{ color: backColor }} />
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							gap: 0.5,
						}}
					>
						<Box
							sx={{
								width: 88,
								height: 88,
								borderRadius: 3,
								bgcolor: coverBg,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								marginBottom: 0.5,
							}}
						>
							<QueueMusicRounded sx={{ fontSize: 46, color: coverIcon }} />
						</Box>
						<Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: titleColor }}>
							Nedělní chvály
						</Typography>
						<Typography sx={{ color: metaColor }}>6 písní · ~24 min</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingBottom: 2 }}>
						<Box
							sx={{
								flex: 1,
								bgcolor: presentBg,
								borderRadius: 999,
								height: 46,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 0.5,
								boxShadow: light
									? '0 4px 14px rgba(0,0,0,0.12)'
									: '0 4px 14px rgba(0,0,0,0.2)',
							}}
						>
							<SlideshowRounded sx={{ color: presentFg }} />
							<Typography strong sx={{ color: presentFg }}>
								Prezentovat
							</Typography>
						</Box>
						{[EditRounded, ShareRounded, MoreHorizRounded].map((Icon, i) => (
							<Box
								key={i}
								sx={{
									width: 46,
									height: 46,
									borderRadius: '50%',
									bgcolor: secBg,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Icon sx={{ color: secIcon }} />
							</Box>
						))}
					</Box>
				</Box>
				{/* compact layer — slim bar (back · title · present) */}
				<Box
					ref={compactRef}
					style={{ opacity: isCompact ? 1 : 0 }}
					sx={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						height: HERO_COMPACT,
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						paddingX: 1.5,
					}}
				>
					<ArrowBackRounded sx={{ color: backColor, flexShrink: 0 }} />
					<Typography
						strong
						noWrap
						sx={{ flex: 1, minWidth: 0, textAlign: 'center', color: titleColor, fontSize: '1.1rem' }}
					>
						Nedělní chvály
					</Typography>
					<SlideshowRounded sx={{ color: light ? 'primary.main' : 'common.white', flexShrink: 0 }} />
				</Box>
			</Box>
			<Box ref={scrollRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingX: 2, paddingTop: 2, paddingBottom: 4 }}>
				<GroupedList />
			</Box>
		</Box>
	)
}

// ===========================================================================
// UNIFIED — the playlist page built on the SAME shared MobileAppHeader every
// other app screen uses (seznam / píseň / účet), surface "grey.50", collapsing
// large title. Just configured with playlist props: subtitle = song count,
// a pinned Prezentovat control, "…" for edit/share, and the ordered list.
function PlaylistUnified() {
	return (
		<MobileAppHeader
			title="Nedělní chvály"
			subtitle="6 písní · ~24 min"
			backTo="account"
			surface="grey.50"
			overlay
			heroIcon={
				<Box
					sx={{
						width: 84,
						height: 84,
						borderRadius: 3,
						bgcolor: 'primary.50',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<QueueMusicRounded sx={{ fontSize: 42, color: 'primary.main' }} />
				</Box>
			}
			actions={[
				<IconButton key="m" color="grey.700" alt="Více">
					<MoreHorizRounded />
				</IconButton>,
			]}
			controlPanel={
				<Box
					sx={{
						bgcolor: 'primary.main',
						borderRadius: 999,
						height: 44,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.5,
						boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
					}}
				>
					<SlideshowRounded sx={{ color: 'common.white' }} />
					<Typography strong sx={{ color: 'common.white' }}>
						Prezentovat
					</Typography>
				</Box>
			}
		>
			<GroupedList />
		</MobileAppHeader>
	)
}

function DemoPlaylist() {
	const params = useSearchParams()
	const f = params.get('f')
	if (f === 'uni') return <PlaylistUnified />
	if (f === 'col') return <CollapsingHero />
	if (f === 'col-exp') return <CollapsingHero demoPhase="expanded" />
	if (f === 'col-cmp') return <CollapsingHero demoPhase="compact" />
	if (f === 'lw-exp') return <CollapsingHero tone="white" demoPhase="expanded" />
	if (f === 'lw-cmp') return <CollapsingHero tone="white" demoPhase="compact" />
	if (f === 'lg-exp') return <CollapsingHero tone="grey" demoPhase="expanded" />
	if (f === 'lg-cmp') return <CollapsingHero tone="grey" demoPhase="compact" />
	if (f === 'h1') return <HeroPlA />
	if (f === 'h2') return <HeroPlB />
	if (f === 'h3') return <HeroPlC />
	if (f === 'real') return <SongReal />
	if (f === 'p1') return <PL1 />
	if (f === 'p2') return <PL2 />
	if (f === 'p3') return <PL3 />
	if (f === 'p4') return <PL4 />
	if (f === 's1') return <SNG1 />
	if (f === 's2') return <SNG2 />
	if (f === 's3') return <SNG3 />
	if (f === 's4') return <SNG4 />
	if (f === 'hero') return <V5 />
	if (f === 'a') return <ReaderA />
	if (f === 'amenu') return <ReaderAMenu />
	if (f === 'b') return <ReaderB />
	if (f === 'c') return <ReaderC />
	if (f === 'present') return <PresentScreen />
	const v = Number(params.get('v') || 1)
	if (v === 2) return <V2 />
	if (v === 3) return <V3 />
	if (v === 4) return <V4 />
	if (v === 5) return <V5 />
	if (v === 6) return <V6 />
	if (v === 7) return <V7 />
	if (v === 8) return <V8 />
	return <V1 />
}
