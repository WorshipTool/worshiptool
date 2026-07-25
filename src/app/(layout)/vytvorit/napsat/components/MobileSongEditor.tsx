'use client'

import { useSheetEditorTempData } from '@/common/components/SheetEditor/useSheetEditorTempData'
import { Box, Typography, useTheme } from '@/common/ui'
import { InputBase, styled } from '@/common/ui/mui'
import { AddRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'

type BlockColors = {
	chordBg: string
	chordFg: string
	sectionBg: string
	sectionFg: string
	ring: string
}

const TitleInput = styled(InputBase)(({ theme }) => ({
	fontWeight: theme.typography.fontWeightBold,
	fontSize: '1.15rem',
}))

// Identical text metrics for the transparent <textarea> and the highlight layer
// below it, so the styled chord blocks line up exactly under the typed text.
const EDITOR_METRICS = {
	margin: 0,
	padding: 0,
	fontFamily: 'inherit',
	fontSize: '1rem',
	lineHeight: 1.9,
	letterSpacing: 'normal',
	whiteSpace: 'pre-wrap',
	overflowWrap: 'break-word',
	boxSizing: 'border-box',
} as const

const SheetArea = styled('textarea')(({ theme }) => ({
	...EDITOR_METRICS,
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	resize: 'none',
	border: 'none',
	outline: 'none',
	background: 'transparent',
	// the text itself is invisible — the highlight layer below shows it
	color: 'transparent',
	caretColor: theme.palette.grey[900],
	'&::placeholder': { color: 'transparent' },
}))

const Highlight = styled('div')(({ theme }) => ({
	...EDITOR_METRICS,
	position: 'absolute',
	inset: 0,
	overflow: 'hidden',
	pointerEvents: 'none',
	color: theme.palette.grey[900],
}))

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']
const TYPES: { label: string; suffix: string }[] = [
	{ label: 'dur', suffix: '' },
	{ label: 'm', suffix: 'm' },
	{ label: '7', suffix: '7' },
	{ label: 'm7', suffix: 'm7' },
	{ label: 'maj7', suffix: 'maj7' },
	{ label: 'sus4', suffix: 'sus4' },
]

const SECTIONS: { mark: string; labelKey: 'verse' | 'chorus' | 'bridge'; color: string }[] = [
	{ mark: 'S', labelKey: 'verse', color: 'primary.main' },
	{ mark: 'R', labelKey: 'chorus', color: 'success.main' },
	{ mark: 'B', labelKey: 'bridge', color: 'secondary.main' },
]

function parseChord(chord: string): { root: string; suffix: string } {
	const m = chord.match(/^([A-H](?:#|b)?)(.*)$/)
	if (!m) return { root: 'C', suffix: '' }
	return { root: m[1], suffix: m[2] }
}

function chordTokenAt(
	text: string,
	pos: number
): { start: number; end: number; chord: string } | null {
	let open = -1
	for (let i = pos - 1; i >= 0; i--) {
		const ch = text[i]
		if (ch === ']' || ch === '\n') break
		if (ch === '[') {
			open = i
			break
		}
	}
	if (open === -1 && text[pos] === '[') open = pos
	if (open === -1) return null
	let close = -1
	for (let i = open + 1; i < text.length; i++) {
		const ch = text[i]
		if (ch === '[' || ch === '\n') break
		if (ch === ']') {
			close = i
			break
		}
	}
	if (close === -1 || pos > close + 1) return null
	return { start: open, end: close + 1, chord: text.substring(open + 1, close) }
}

// Render one [chord] / {section} token as a block. The brackets/braces stay in
// the text (so the block lines up under the textarea) but are drawn transparent,
// acting as the block's inner padding — only the chord/section letter shows.
function renderToken(
	tok: string,
	start: number,
	key: number,
	colors: BlockColors,
	active: boolean
): ReactNode {
	const isChord = tok[0] === '['
	const block = isChord
		? { backgroundColor: colors.chordBg, color: colors.chordFg }
		: { backgroundColor: colors.sectionBg, color: colors.sectionFg }
	return (
		<span
			key={key}
			style={{
				...block,
				borderRadius: 4,
				boxShadow: active ? `0 0 0 2px ${colors.ring}` : undefined,
			}}
		>
			<span style={{ color: 'transparent' }}>{tok[0]}</span>
			{tok.slice(1, -1)}
			<span style={{ color: 'transparent' }}>{tok[tok.length - 1]}</span>
		</span>
	)
}

function renderHighlight(
	text: string,
	colors: BlockColors,
	editRange: { start: number; end: number } | null
): ReactNode[] {
	const out: ReactNode[] = []
	const re = /(\[[^\]\n]*\]|\{[^}\n]*\})/g
	let last = 0
	let m: RegExpExecArray | null
	let k = 0
	while ((m = re.exec(text)) !== null) {
		if (m.index > last) out.push(<span key={k++}>{text.slice(last, m.index)}</span>)
		const end = m.index + m[0].length
		const active = !!editRange && editRange.start === m.index && editRange.end === end
		out.push(renderToken(m[0], m.index, k++, colors, active))
		last = end
	}
	// trailing text (+ a zero-width char so the last line keeps its height)
	out.push(<span key={k++}>{text.slice(last) + '​'}</span>)
	return out
}

type MobileSongEditorProps = {
	onTitleChange?: (title: string) => void
	onSheetDataChange?: (sheetData: string) => void
}

/**
 * Phone song editor with an interactive chord workflow. Lyrics are typed in a
 * full-height field where chords render as tappable colour blocks (a transparent
 * textarea over a highlight layer). One bottom row carries the section markers
 * (Sloka / Refrén / Bridge) plus an "+ Akord" button. Tapping "+ Akord" drops a
 * chord at the caret and opens a chord picker (root + type); tapping an existing
 * chord block selects it and opens the same picker. The picker rewrites the
 * chord live — no confirm step. Desktop keeps the classic SheetEditor.
 */
export default function MobileSongEditor(props: MobileSongEditorProps) {
	const t = useTranslations('songEditor')
	const theme = useTheme()

	const { title: tempTitle, sheetData: tempSheet } = useSheetEditorTempData(true)
	const [title, setTitleState] = useState(tempTitle)
	const [sheetData, setSheetDataState] = useState(tempSheet)

	const sheetRef = useRef<HTMLTextAreaElement | null>(null)
	const highlightRef = useRef<HTMLDivElement | null>(null)
	const caretRef = useRef<{ start: number; end: number; focus: boolean } | null>(null)

	const [pickerOpen, setPickerOpen] = useState(false)
	const [editRange, setEditRange] = useState<{ start: number; end: number } | null>(null)
	const [root, setRoot] = useState('C')
	const [suffix, setSuffix] = useState('')

	const blockColors: BlockColors = {
		chordBg: theme.palette.primary.main,
		chordFg: theme.palette.primary.contrastText,
		sectionBg: theme.palette.grey[300],
		sectionFg: theme.palette.grey[800],
		ring: theme.palette.primary.dark,
	}

	const setTitle = (v: string) => {
		setTitleState(v)
		props.onTitleChange?.(v)
	}
	const setSheet = (v: string) => {
		setSheetDataState(v)
		props.onSheetDataChange?.(v)
	}

	// keep the highlight layer scrolled in step with the textarea
	const syncScroll = () => {
		if (highlightRef.current && sheetRef.current) {
			highlightRef.current.scrollTop = sheetRef.current.scrollTop
			highlightRef.current.scrollLeft = sheetRef.current.scrollLeft
		}
	}

	useLayoutEffect(() => {
		if (caretRef.current && sheetRef.current) {
			const { start, end, focus } = caretRef.current
			sheetRef.current.setSelectionRange(start, end)
			if (focus) sheetRef.current.focus()
			caretRef.current = null
		}
		syncScroll()
	}, [sheetData])

	const insertSection = (mark: string) => {
		const ta = sheetRef.current
		const pos = ta ? ta.selectionStart : sheetData.length
		const insert = `{${mark}}`
		setSheet(sheetData.slice(0, pos) + insert + sheetData.slice(pos))
		const c = pos + insert.length
		caretRef.current = { start: c, end: c, focus: true }
	}

	const applyChord = (nextRoot: string, nextSuffix: string, range = editRange) => {
		if (!range) return
		const token = `[${nextRoot}${nextSuffix}]`
		setSheet(sheetData.slice(0, range.start) + token + sheetData.slice(range.end))
		setEditRange({ start: range.start, end: range.start + token.length })
	}

	const pickRoot = (r: string) => {
		setRoot(r)
		applyChord(r, suffix)
	}
	const pickType = (s: string) => {
		setSuffix(s)
		applyChord(root, s)
	}

	const addChord = () => {
		const ta = sheetRef.current
		const pos = ta ? ta.selectionStart : sheetData.length
		const token = '[C]'
		setSheet(sheetData.slice(0, pos) + token + sheetData.slice(pos))
		setEditRange({ start: pos, end: pos + token.length })
		setRoot('C')
		setSuffix('')
		setPickerOpen(true)
		ta?.blur()
	}

	const onSheetClick = () => {
		const ta = sheetRef.current
		if (!ta || ta.selectionStart !== ta.selectionEnd) return
		const tok = chordTokenAt(sheetData, ta.selectionStart)
		if (!tok) return
		const parsed = parseChord(tok.chord)
		setEditRange({ start: tok.start, end: tok.end })
		setRoot(parsed.root)
		setSuffix(parsed.suffix)
		setPickerOpen(true)
		ta.blur()
	}

	const closePicker = () => {
		const range = editRange
		setPickerOpen(false)
		setEditRange(null)
		if (range) caretRef.current = { start: range.end, end: range.end, focus: false }
	}

	return (
		<>
			<Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
				<TitleInput
					placeholder={t('titlePlaceholder')}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				{/* editable field: transparent textarea over a highlight layer that
				    draws the chords as colour blocks */}
				<Box sx={{ position: 'relative', flex: 1, minHeight: 0, marginTop: 1 }}>
					<Highlight ref={highlightRef} aria-hidden>
						{sheetData === '' ? (
							<span style={{ color: theme.palette.grey[500] }}>
								{t('contentPlaceholder')}
							</span>
						) : (
							renderHighlight(sheetData, blockColors, editRange)
						)}
					</Highlight>
					<SheetArea
						ref={sheetRef}
						aria-label={t('contentPlaceholder')}
						value={sheetData}
						onChange={(e) => setSheet(e.target.value)}
						onClick={onSheetClick}
						onScroll={syncScroll}
						spellCheck={false}
					/>
				</Box>

				{/* one bottom row: section markers + add-chord */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.75,
						paddingTop: 1,
						paddingBottom: 0.5,
					}}
				>
					{SECTIONS.map((s) => (
						<Box
							key={s.mark}
							component="button"
							type="button"
							onClick={() => insertSection(s.mark)}
							sx={{
								flexShrink: 0,
								height: 38,
								paddingX: 1.5,
								borderRadius: 1.5,
								border: 'none',
								bgcolor: s.color,
								color: 'common.white',
								fontWeight: 700,
								fontSize: '0.82rem',
								cursor: 'pointer',
							}}
						>
							{t(s.labelKey)}
						</Box>
					))}
					<Box sx={{ flex: 1 }} />
					<Box
						component="button"
						type="button"
						onClick={addChord}
						sx={{
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							height: 38,
							paddingX: 1.75,
							borderRadius: 999,
							border: '1px solid',
							borderColor: 'primary.main',
							bgcolor: 'transparent',
							color: 'primary.main',
							fontWeight: 700,
							fontSize: '0.85rem',
							cursor: 'pointer',
						}}
					>
						<AddRounded sx={{ fontSize: 18 }} />
						{t('chord')}
					</Box>
				</Box>
			</Box>

			{/* live chord picker — edits the selected chord as you tap, no confirm */}
			{pickerOpen && (
				<>
					<Box
						onClick={closePicker}
						sx={{
							position: 'fixed',
							inset: 0,
							zIndex: 1240,
							bgcolor: 'rgba(0,0,0,0.28)',
						}}
					/>
					<Box
						sx={{
							position: 'fixed',
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 1250,
							bgcolor: 'background.paper',
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							boxShadow: '0 -8px 28px rgba(0,0,0,0.2)',
							padding: 2.5,
							paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
							display: 'flex',
							flexDirection: 'column',
							gap: 1.5,
						}}
					>
						<Box
							sx={{
								width: 40,
								height: 4,
								borderRadius: 2,
								bgcolor: 'grey.300',
								alignSelf: 'center',
							}}
						/>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Typography strong={800} sx={{ fontSize: '1.05rem' }}>
								{t('chord')}
							</Typography>
							<Typography strong={800} color="primary.main" sx={{ fontSize: '1.25rem' }}>
								{root}
								{suffix}
							</Typography>
							<Box sx={{ flex: 1 }} />
							<Box
								component="button"
								type="button"
								onClick={closePicker}
								sx={{
									border: 'none',
									bgcolor: 'primary.main',
									color: 'common.white',
									fontWeight: 700,
									fontSize: '0.9rem',
									paddingX: 2.25,
									paddingY: 0.75,
									borderRadius: 999,
									cursor: 'pointer',
								}}
							>
								{t('done')}
							</Box>
						</Box>

						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
							{ROOTS.map((r) => {
								const active = r === root
								return (
									<Box
										key={r}
										component="button"
										type="button"
										onClick={() => pickRoot(r)}
										sx={{
											width: 52,
											height: 44,
											borderRadius: 2,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 700,
											cursor: 'pointer',
											border: '1px solid',
											borderColor: active ? 'primary.main' : 'grey.300',
											bgcolor: active ? 'primary.main' : 'grey.50',
											color: active ? 'common.white' : 'grey.900',
										}}
									>
										{r}
									</Box>
								)
							})}
						</Box>

						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
							{TYPES.map((ty) => {
								const active = ty.suffix === suffix
								return (
									<Box
										key={ty.label}
										component="button"
										type="button"
										onClick={() => pickType(ty.suffix)}
										sx={{
											paddingX: 1.75,
											height: 40,
											borderRadius: 999,
											display: 'flex',
											alignItems: 'center',
											fontWeight: 600,
											fontSize: '0.9rem',
											cursor: 'pointer',
											border: '1px solid',
											borderColor: active ? 'primary.main' : 'grey.300',
											bgcolor: active ? 'primary.main' : 'transparent',
											color: active ? 'common.white' : 'grey.700',
										}}
									>
										{ty.label}
									</Box>
								)
							})}
						</Box>
					</Box>
				</>
			)}
		</>
	)
}
