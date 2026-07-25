'use client'

import { useSheetEditorTempData } from '@/common/components/SheetEditor/useSheetEditorTempData'
import { Box, Typography } from '@/common/ui'
import { InputBase, styled } from '@/common/ui/mui'
import { AddRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useLayoutEffect, useRef, useState } from 'react'

const TitleInput = styled(InputBase)(({ theme }) => ({
	fontWeight: theme.typography.fontWeightBold,
	fontSize: '1.15rem',
}))

// Chord picker vocabulary. Roots use Czech notation (H = B natural); the type
// suffix is appended to the root to form the chord (e.g. G + m7 → Gm7).
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

// Split a chord string into its root + type suffix (e.g. "Gm7" → G / m7).
function parseChord(chord: string): { root: string; suffix: string } {
	const m = chord.match(/^([A-H](?:#|b)?)(.*)$/)
	if (!m) return { root: 'C', suffix: '' }
	return { root: m[1], suffix: m[2] }
}

// If the caret sits inside a [chord] token on its line, return the token bounds
// (including brackets) and its inner chord; otherwise null.
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

type MobileSongEditorProps = {
	onTitleChange?: (title: string) => void
	onSheetDataChange?: (sheetData: string) => void
}

/**
 * Phone song editor with an interactive chord workflow. Lyrics are typed in a
 * full-height text field (chords inline as `[X]`). One bottom row carries the
 * section markers (Sloka / Refrén / Bridge) plus an "+ Akord" button. Tapping an
 * existing chord in the text selects it and opens a chord picker (root + type)
 * that rewrites the chord live — no confirm step. "+ Akord" inserts a chord at
 * the caret and opens the same picker. Desktop keeps the classic SheetEditor.
 */
export default function MobileSongEditor(props: MobileSongEditorProps) {
	const t = useTranslations('songEditor')

	const { title: tempTitle, sheetData: tempSheet } = useSheetEditorTempData(true)
	const [title, setTitleState] = useState(tempTitle)
	const [sheetData, setSheetDataState] = useState(tempSheet)

	const sheetRef = useRef<HTMLTextAreaElement | null>(null)
	// pending caret/selection to apply after a value change (mirrors SheetEditor)
	const caretRef = useRef<{ start: number; end: number; focus: boolean } | null>(null)

	const [pickerOpen, setPickerOpen] = useState(false)
	// bounds of the [chord] token currently being edited
	const [editRange, setEditRange] = useState<{ start: number; end: number } | null>(null)
	const [root, setRoot] = useState('C')
	const [suffix, setSuffix] = useState('')

	const setTitle = (v: string) => {
		setTitleState(v)
		props.onTitleChange?.(v)
	}
	const setSheet = (v: string) => {
		setSheetDataState(v)
		props.onSheetDataChange?.(v)
	}

	useLayoutEffect(() => {
		if (caretRef.current && sheetRef.current) {
			const { start, end, focus } = caretRef.current
			sheetRef.current.setSelectionRange(start, end)
			if (focus) sheetRef.current.focus()
			caretRef.current = null
		}
	}, [sheetData])

	// insert a section marker ({S}/{R}/{B}) at the caret
	const insertSection = (mark: string) => {
		const ta = sheetRef.current
		const pos = ta ? ta.selectionStart : sheetData.length
		const insert = `{${mark}}`
		setSheet(sheetData.slice(0, pos) + insert + sheetData.slice(pos))
		const c = pos + insert.length
		caretRef.current = { start: c, end: c, focus: true }
	}

	// replace the token in editRange with the chord built from root+suffix (live)
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

	// "+ Akord": drop a default chord at the caret and open the picker on it
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

	// tapping in the text: if the caret landed on a chord, open the picker on it
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
			<Box
				sx={{
					minHeight: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<TitleInput
					placeholder={t('titlePlaceholder')}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<InputBase
					inputRef={sheetRef}
					placeholder={t('contentPlaceholder')}
					multiline
					value={sheetData}
					onChange={(e) => setSheet(e.target.value)}
					onClick={onSheetClick}
					sx={{
						flex: 1,
						alignItems: 'stretch',
						marginTop: 1,
						'& textarea': {
							height: '100% !important',
							overflow: 'auto !important',
							lineHeight: 1.9,
						},
					}}
				/>

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

						{/* root notes */}
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

						{/* chord type */}
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
