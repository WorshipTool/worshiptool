'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Typography, useTheme } from '@/common/ui'
import {
	ExpandMoreRounded,
	FavoriteBorderRounded,
	HomeRounded,
	LibraryMusicRounded,
	MoreVertRounded,
	PersonRounded,
	PlaylistAddRounded,
	PrintRounded,
	RemoveRounded,
	AddRounded,
	MusicNoteRounded,
} from '@mui/icons-material'
import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

export default SmartPage(DemoSong, ['fullWidth', 'hideFooter', 'hideToolbar'])

const MAXW = 480
const PRIMARY = 'primary.main'

// ---- mock song content ------------------------------------------------
type Line = { chords?: string[]; text: string }
const VERSE_A: Line[] = [
	{ chords: ['D', 'Hm', 'G', 'A'], text: 'Advent, advent, my čekáme na Tvé narozeniny.' },
	{ chords: ['D', 'Hm', 'G', 'A', 'D'], text: 'Advent, advent, brzy přijdeš do naší rodiny.' },
]
const VERSE_B: Line[] = [
	{ text: 'Pane Ježíši čekáme na Tvé narozeniny.' },
	{ text: 'Ježíši, Ty brzy přijdeš do naší rodiny.' },
]

function Lyrics({ big }: { big?: boolean }) {
	const line = (l: Line, i: number) => (
		<Box key={i} sx={{ marginBottom: 0.75 }}>
			{l.chords && (
				<Box sx={{ display: 'flex', gap: 3.5, flexWrap: 'wrap' }}>
					{l.chords.map((c, j) => (
						<Typography key={j} strong sx={{ color: PRIMARY, fontSize: big ? '1rem' : '0.9rem' }}>
							{c}
						</Typography>
					))}
				</Box>
			)}
			<Typography sx={{ fontSize: big ? '1.2rem' : '1.05rem', lineHeight: 1.55 }}>{l.text}</Typography>
		</Box>
	)
	const verse = (label: string, lines: Line[], key: string) => (
		<Box key={key} sx={{ display: 'flex', gap: 1.5, marginBottom: 2.5 }}>
			<Typography color="grey.400" strong sx={{ fontSize: big ? '1rem' : '0.9rem', minWidth: 18 }}>
				{label}
			</Typography>
			<Box sx={{ flex: 1 }}>{lines.map(line)}</Box>
		</Box>
	)
	return (
		<Box>
			{verse('1.', VERSE_A, 'a')}
			{verse('2.', VERSE_B, 'b')}
			{verse('3.', VERSE_A, 'c')}
			{verse('4.', VERSE_B, 'd')}
		</Box>
	)
}

// ---- control atoms ----------------------------------------------------
function IconBtn({ children }: { children: ReactNode }) {
	return (
		<Box
			sx={{
				width: 40,
				height: 40,
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'grey.700',
			}}
		>
			{children}
		</Box>
	)
}

function Transpose({ compact }: { compact?: boolean }) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: compact ? 0 : 0.5,
				border: '1px solid',
				borderColor: 'grey.300',
				borderRadius: 5,
				paddingX: 0.5,
				height: 40,
			}}
		>
			<IconBtn>
				<RemoveRounded fontSize="small" />
			</IconBtn>
			{!compact && (
				<Typography small strong uppercase color="grey.700">
					Transpozice
				</Typography>
			)}
			{compact && <MusicNoteRounded fontSize="small" sx={{ color: 'grey.600' }} />}
			<IconBtn>
				<AddRounded fontSize="small" />
			</IconBtn>
		</Box>
	)
}

function ChordsToggle() {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 40, paddingX: 1 }}>
			<MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} />
			<Typography small strong color="grey.700">
				Akordy
			</Typography>
		</Box>
	)
}

// ---- brand + shell helpers -------------------------------------------
function Bleed({ bg, children }: { bg: string; children: ReactNode }) {
	return (
		<Box
			sx={{
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				// demo route isn't an app-shell route, so reclaim the 56px top-bar
				// placeholder too (on the real song page this is already handled)
				marginTop: 'calc(-1 * env(safe-area-inset-top) - 56px)',
				minHeight: '100dvh',
				bgcolor: bg,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box sx={{ width: '100%', maxWidth: MAXW, minHeight: '100dvh', position: 'relative' }}>
				{children}
			</Box>
		</Box>
	)
}

function MockTabBar() {
	const theme = useTheme()
	const tab = (icon: ReactNode, label: string, active?: boolean) => (
		<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, color: active ? '#fff' : 'rgba(255,255,255,0.72)' }}>
			{icon}
			<Typography sx={{ fontSize: '0.72rem', color: 'inherit', fontWeight: active ? 700 : 500 }}>{label}</Typography>
		</Box>
	)
	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 0,
				left: '50%',
				transform: 'translateX(-50%)',
				width: '100%',
				maxWidth: MAXW,
				height: 'calc(env(safe-area-inset-bottom) + 64px)',
				paddingBottom: 'env(safe-area-inset-bottom)',
				background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
				display: 'flex',
				alignItems: 'center',
				paddingX: 2,
				zIndex: 20,
			}}
		>
			{tab(<HomeRounded />, 'Domů')}
			{tab(<LibraryMusicRounded />, 'Písně', true)}
			{tab(<PersonRounded />, 'Účet')}
		</Box>
	)
}

const TOP = 'calc(env(safe-area-inset-top) + 16px)'
const BOTTOM_CLEAR = 'calc(env(safe-area-inset-bottom) + 96px)'

// ======================================================================
// VARIANT 1 — clean white page, inline controls at top
function V1() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: BOTTOM_CLEAR }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 1 }}>
					<Transpose />
					<ChordsToggle />
					<Box sx={{ flex: 1 }} />
					<IconBtn><PrintRounded fontSize="small" /></IconBtn>
					<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
				</Box>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>
					Advent, advent
				</Typography>
				<Lyrics />
			</Box>
		</Bleed>
	)
}

// VARIANT 2 — sticky app bar (title + compact controls stay on top)
function V2() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingBottom: BOTTOM_CLEAR }}>
				<Box
					sx={{
						position: 'sticky',
						top: 0,
						zIndex: 5,
						bgcolor: 'background.paper',
						borderBottom: '1px solid',
						borderColor: 'grey.200',
						paddingTop: TOP,
						paddingBottom: 1,
						paddingX: 2,
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
					}}
				>
					<Typography strong={700} noWrap sx={{ flex: 1, fontSize: '1.1rem' }}>
						Advent, advent
					</Typography>
					<Transpose compact />
					<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
				</Box>
				<Box sx={{ paddingX: 2.5, paddingTop: 2 }}>
					<Lyrics />
				</Box>
			</Box>
		</Bleed>
	)
}

// VARIANT 3 — clean lyrics + floating bottom control dock (player style)
function V3() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 150px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>
					Advent, advent
				</Typography>
				<Lyrics />
			</Box>
			{/* floating dock above the tab bar */}
			<Box
				sx={{
					position: 'fixed',
					bottom: 'calc(env(safe-area-inset-bottom) + 76px)',
					left: '50%',
					transform: 'translateX(-50%)',
					width: 'calc(100% - 32px)',
					maxWidth: MAXW - 32,
					bgcolor: 'background.paper',
					borderRadius: 3,
					boxShadow: '0 6px 24px rgba(0,0,0,0.16)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingX: 1,
					height: 56,
					zIndex: 15,
				}}
			>
				<Transpose />
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconBtn><MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} /></IconBtn>
					<IconBtn><FavoriteBorderRounded fontSize="small" /></IconBtn>
					<IconBtn><PlaylistAddRounded fontSize="small" /></IconBtn>
					<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
				</Box>
			</Box>
		</Bleed>
	)
}

// VARIANT 4 — white card on the grey canvas
function V4() {
	return (
		<Bleed bg="grey.200">
			<Box sx={{ paddingX: 1.5, paddingTop: 'calc(env(safe-area-inset-top) + 16px)', paddingBottom: BOTTOM_CLEAR }}>
				<Box sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1, padding: 2.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 1 }}>
						<Transpose />
						<Box sx={{ flex: 1 }} />
						<IconBtn><PrintRounded fontSize="small" /></IconBtn>
						<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
					</Box>
					<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>
						Advent, advent
					</Typography>
					<Lyrics />
				</Box>
			</Box>
		</Bleed>
	)
}

// VARIANT 5 — focus / reading mode (big type, single floating menu)
function V5() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 3, paddingTop: 'calc(env(safe-area-inset-top) + 32px)', paddingBottom: BOTTOM_CLEAR }}>
				<Typography variant="h3" strong={800} align="center" sx={{ marginBottom: 3 }}>
					Advent, advent
				</Typography>
				<Lyrics big />
			</Box>
			<Box
				sx={{
					position: 'fixed',
					bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
					right: 20,
					width: 52,
					height: 52,
					borderRadius: '50%',
					bgcolor: 'background.paper',
					boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 15,
				}}
			>
				<ExpandMoreRounded />
			</Box>
		</Bleed>
	)
}

// ---- more control atoms ----------------------------------------------
function LabeledIcon({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, minWidth: 48, color: active ? PRIMARY : 'grey.600' }}>
			{icon}
			<Typography sx={{ fontSize: '0.62rem', color: 'inherit', fontWeight: 600 }}>{label}</Typography>
		</Box>
	)
}

function ToggleSwitch({ on }: { on?: boolean }) {
	return (
		<Box sx={{ width: 40, height: 24, borderRadius: 12, bgcolor: on ? PRIMARY : 'grey.300', display: 'flex', alignItems: 'center', padding: '2px', justifyContent: on ? 'flex-end' : 'flex-start' }}>
			<Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
		</Box>
	)
}

// VARIANT 6 — full-width solid toolbar attached above the tab bar
function V6() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 130px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 64px)', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: MAXW, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'grey.200', boxShadow: '0 -2px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 0.5, paddingX: 1, height: 54, zIndex: 15 }}>
				<Transpose />
				<Box sx={{ flex: 1 }} />
				<IconBtn><MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} /></IconBtn>
				<IconBtn><FavoriteBorderRounded fontSize="small" /></IconBtn>
				<IconBtn><PlaylistAddRounded fontSize="small" /></IconBtn>
				<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
			</Box>
		</Bleed>
	)
}

// VARIANT 7 — floating dock with labels under icons
function V7() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 150px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 76px)', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: MAXW - 32, bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingY: 1, zIndex: 15 }}>
				<LabeledIcon icon={<RemoveRounded />} label="Níž" />
				<LabeledIcon icon={<AddRounded />} label="Výš" />
				<LabeledIcon icon={<MusicNoteRounded />} label="Akordy" active />
				<LabeledIcon icon={<FavoriteBorderRounded />} label="Oblíbit" />
				<LabeledIcon icon={<MoreVertRounded />} label="Více" />
			</Box>
		</Bleed>
	)
}

// VARIANT 8 — transpose-hero dock (segmented transpose in the middle)
function V8() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 150px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 76px)', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: MAXW - 32, bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 1.5, height: 60, zIndex: 15 }}>
				<IconBtn><MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} /></IconBtn>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'grey.100', borderRadius: 5, paddingX: 0.5, height: 44 }}>
					<IconBtn><RemoveRounded /></IconBtn>
					<Typography strong sx={{ minWidth: 64, textAlign: 'center' }}>Tónina D</Typography>
					<IconBtn><AddRounded /></IconBtn>
				</Box>
				<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
			</Box>
		</Bleed>
	)
}

// VARIANT 9 — minimal thin bar: chords switch + transpose
function V9() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 130px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 64px)', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: MAXW, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 1.5, paddingX: 2.5, height: 52, zIndex: 15 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography small strong color="grey.700">Akordy</Typography>
					<ToggleSwitch on />
				</Box>
				<Box sx={{ flex: 1 }} />
				<Transpose compact />
				<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
			</Box>
		</Bleed>
	)
}

// VARIANT 10 — two floating FABs bottom-right (text unobstructed)
function V10() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: BOTTOM_CLEAR }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 80px)', right: 16, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', zIndex: 15 }}>
				<Box sx={{ bgcolor: 'background.paper', borderRadius: 5, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingY: 0.5 }}>
					<IconBtn><AddRounded /></IconBtn>
					<Typography small strong color="primary.main">D</Typography>
					<IconBtn><RemoveRounded /></IconBtn>
				</Box>
				<Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: 'background.paper', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<MoreVertRounded />
				</Box>
			</Box>
		</Bleed>
	)
}

// VARIANT 11 — solid bottom bar, transpose centred, controls on the sides
function V11() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 130px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 64px)', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: MAXW, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'grey.200', boxShadow: '0 -2px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 2, height: 56, zIndex: 15 }}>
				<IconBtn><MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} /></IconBtn>
				<Transpose />
				<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
			</Box>
		</Bleed>
	)
}

// VARIANT 12 — floating dock, transpose centred with the current key
function V12() {
	return (
		<Bleed bg="background.paper">
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100dvh', paddingX: 2.5, paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 150px)' }}>
				<Typography variant="h4" strong={800} sx={{ marginBottom: 1.5 }}>Advent, advent</Typography>
				<Lyrics />
			</Box>
			<Box sx={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 76px)', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: MAXW - 32, bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 1, height: 58, zIndex: 15 }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconBtn><MusicNoteRounded fontSize="small" sx={{ color: PRIMARY }} /></IconBtn>
					<IconBtn><FavoriteBorderRounded fontSize="small" /></IconBtn>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, bgcolor: 'grey.100', borderRadius: 5, paddingX: 0.5, height: 42 }}>
					<IconBtn><RemoveRounded /></IconBtn>
					<Typography strong sx={{ minWidth: 54, textAlign: 'center' }}>Tónina D</Typography>
					<IconBtn><AddRounded /></IconBtn>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconBtn><PlaylistAddRounded fontSize="small" /></IconBtn>
					<IconBtn><MoreVertRounded fontSize="small" /></IconBtn>
				</Box>
			</Box>
		</Bleed>
	)
}

function DemoSong() {
	const v = Number(useSearchParams().get('v') || 1)
	return (
		<>
			{v === 1 && <V1 />}
			{v === 2 && <V2 />}
			{v === 3 && <V3 />}
			{v === 4 && <V4 />}
			{v === 5 && <V5 />}
			{v === 6 && <V6 />}
			{v === 7 && <V7 />}
			{v === 8 && <V8 />}
			{v === 9 && <V9 />}
			{v === 10 && <V10 />}
			{v === 11 && <V11 />}
			{v === 12 && <V12 />}
			<MockTabBar />
		</>
	)
}
