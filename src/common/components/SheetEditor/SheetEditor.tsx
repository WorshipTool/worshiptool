import ToolPanel from '@/app/(layout)/vytvorit/napsat/components/ToolPanel'
import { Box } from '@/common/ui'
import { InputBase, styled, SxProps } from '@/common/ui/mui'
import { useLayoutEffect, useRef, useState } from 'react'

const TitleInput = styled(InputBase)(({ theme }) => ({
	fontWeight: theme.typography.fontWeightBold,
}))
const SheetInput = styled(InputBase)(({}) => ({
	minHeight: 200,
	justifyContent: 'start',
	alignItems: 'start',
}))

interface SheetEditorProps {
	onTitleChange?: (title: string) => void
	onSheetDataChange?: (sheetData: string) => void
	startTitle?: string
	startSheetData?: string

	sx?: SxProps
}

export default function SheetEditor(props: SheetEditorProps) {
	const [title, _setTitle] = useState(props.startTitle || '')
	const [sheetData, _setSheetData] = useState(props.startSheetData || '')

	const sheetInputRef: any = useRef(null)
	const titleInputRef: any = useRef(null)
	const cursorRef = useRef<{ start: number; end: number } | null>() // Ref pro uchování pozice kurzoru

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
				placeholder="Zadejte název písně"
				inputRef={titleInputRef}
				value={title}
				onChange={(e) => {
					setTitle(e.target.value)
				}}
			/>
			<SheetInput
				placeholder="Zde je místo pro obsah písně..."
				inputRef={sheetInputRef}
				multiline
				value={sheetData}
				onChange={(e) => {
					setSheetData(e.target.value)
				}}
			/>
			<Box flex={1} />
			<ToolPanel onNewSection={newSection} onNewChord={newChord} />
		</Box>
	)
}
