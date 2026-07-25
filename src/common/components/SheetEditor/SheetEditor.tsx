import ToolPanel from '@/app/(layout)/vytvorit/napsat/components/ToolPanel'
import { useSheetEditorTempData } from '@/common/components/SheetEditor/useSheetEditorTempData'
import { Box } from '@/common/ui'
import { InputBase, styled, SxProps } from '@/common/ui/mui'
import { useTranslations } from 'next-intl'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TitleInput = styled(InputBase)(({ theme }) => ({
	fontWeight: theme.typography.fontWeightBold,
}))
const SheetInput = styled(InputBase)(({}) => ({
	minHeight: 200,
	justifyContent: 'start',
	alignItems: 'start',
}))

// Common chords offered as one-tap chips in the mobile chord palette (Czech
// notation: H = B). Ordered roughly by how often they come up in worship songs.
const COMMON_CHORDS = [
	'C',
	'G',
	'D',
	'A',
	'E',
	'F',
	'H',
	'Am',
	'Em',
	'Dm',
	'Hm',
	'Fm',
	'Cm',
	'Gm',
	'G7',
	'D7',
	'A7',
	'C7',
]

interface SheetEditorProps {
	onTitleChange?: (title: string) => void
	onSheetDataChange?: (sheetData: string) => void
	startTitle?: string
	startSheetData?: string

	sx?: SxProps
	useExampleData?: boolean
	/**
	 * Stretch the sheet text field to fill available height (with the toolbar
	 * pinned at the bottom) instead of the default content-height layout. Used by
	 * the phone editor so the writing area fills the screen; desktop omits it.
	 */
	fill?: boolean
}

export default function SheetEditor(props: SheetEditorProps) {
	const t = useTranslations('songEditor')
	//TODO: maybe remove this line
	const { title: tempTitle, sheetData: sd } = useSheetEditorTempData(
		!props.useExampleData
	)
	const [title, _setTitle] = useState(props.startTitle || tempTitle)
	const [sheetData, _setSheetData] = useState(props.startSheetData || sd)

	const sheetInputRef: any = useRef(null)
	const titleInputRef: any = useRef(null)
	const cursorRef = useRef<{ start: number; end: number } | null>() // Ref pro uchování pozice kurzoru

	useEffect(() => {
		props.onTitleChange?.(title)
		props.onSheetDataChange?.(sheetData)
	}, [])

	const setSheetData = (data: string) => {
		_setSheetData(data)
		if (props.onSheetDataChange) {
			props.onSheetDataChange(data)
		}
	}

	const setTitle = (data: string) => {
		_setTitle(data)
		if (props.onTitleChange) {
			props.onTitleChange(data)
		}
	}

	const newSection = (name: string) => {
		const target = sheetInputRef.current
		let textToInsert = `{${name}}`
		let cursorPosition = target.selectionStart
		let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
		let textAfterCursorPosition = target.value.substring(
			cursorPosition,
			target.value.length
		)
		setSheetData(
			textBeforeCursorPosition + textToInsert + textAfterCursorPosition
		)

		const pos = target.selectionEnd + textToInsert.length
		cursorRef.current = {
			start: pos,
			end: pos,
		}
	}

	const newChord = () => {
		const target = sheetInputRef.current
		if (!target) return

		const textToInsert = '[C]'
		const cursorPosition = target.selectionStart
		const textBefore = sheetData.substring(0, cursorPosition)
		const textAfter = sheetData.substring(cursorPosition)
		const newValue = textBefore + textToInsert + textAfter

		setSheetData(newValue)

		// Nastavení pozice kurzoru na 'C'
		cursorRef.current = {
			start: cursorPosition + 1, // Pozice 'C'
			end: cursorPosition + 2, // Za 'C'
		}
	}

	// Insert a ready-made chord (e.g. from the mobile chord palette) at the caret,
	// leaving the cursor right after it so writing can continue.
	const insertChord = (chord: string) => {
		const target = sheetInputRef.current
		if (!target) return

		const textToInsert = `[${chord}]`
		const cursorPosition = target.selectionStart
		const textBefore = sheetData.substring(0, cursorPosition)
		const textAfter = sheetData.substring(cursorPosition)

		setSheetData(textBefore + textToInsert + textAfter)

		const pos = cursorPosition + textToInsert.length
		cursorRef.current = { start: pos, end: pos }
	}

	useLayoutEffect(() => {
		if (cursorRef.current !== null) {
			const target = sheetInputRef.current
			if (cursorRef.current)
				target.setSelectionRange(cursorRef.current.start, cursorRef.current.end)
			target.focus()
			cursorRef.current = null // Resetování ref po nastavení kurzoru
		}
	}, [sheetData])

	return (
		<Box display={'flex'} flexDirection={'column'} flex={1} sx={props.sx}>
			<TitleInput
				placeholder={t('titlePlaceholder')}
				inputRef={titleInputRef}
				value={title}
				onChange={(e) => {
					setTitle(e.target.value)
				}}
			/>
			<SheetInput
				placeholder={t('contentPlaceholder')}
				inputRef={sheetInputRef}
				multiline
				value={sheetData}
				onChange={(e) => {
					setSheetData(e.target.value)
				}}
				sx={
					props.fill
						? {
								flex: 1,
								alignItems: 'stretch',
								'& textarea': {
									height: '100% !important',
									overflow: 'auto !important',
								},
						  }
						: undefined
				}
			/>
			{!props.fill && <Box flex={1} />}
			{props.fill && (
				<Box
					sx={{
						display: 'flex',
						gap: 0.75,
						overflowX: 'auto',
						paddingY: 1,
						// clean edge-to-edge strip: no visible scrollbar
						scrollbarWidth: 'none',
						'&::-webkit-scrollbar': { display: 'none' },
					}}
				>
					{COMMON_CHORDS.map((chord) => (
						<Box
							key={chord}
							component="button"
							type="button"
							onClick={() => insertChord(chord)}
							sx={{
								flexShrink: 0,
								minWidth: 46,
								height: 40,
								paddingX: 1.25,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'grey.300',
								bgcolor: 'grey.100',
								color: 'grey.900',
								fontWeight: 700,
								fontSize: '0.95rem',
								cursor: 'pointer',
								transition: 'background-color 0.12s',
								'&:active': { bgcolor: 'grey.200' },
							}}
						>
							{chord}
						</Box>
					))}
				</Box>
			)}
			<ToolPanel onNewSection={newSection} onNewChord={newChord} />
		</Box>
	)
}
