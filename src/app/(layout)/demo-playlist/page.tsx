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

function DemoPlaylist() {
	const v = Number(useSearchParams().get('v') || 1)
	if (v === 2) return <V2 />
	if (v === 3) return <V3 />
	if (v === 4) return <V4 />
	return <V1 />
}
