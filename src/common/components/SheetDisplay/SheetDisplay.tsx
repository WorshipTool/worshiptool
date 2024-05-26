import { Sheet } from '@pepavlin/sheet-api'
import { note, signature } from '@pepavlin/sheet-api/lib/models/note'
import EditSheet from './components/EditSheet'
import { SheetStyle, sheetStyles } from './styles/config'

interface SheetDisplayProps {
	// Type of variant is keys of sheetStyles
	variant?: SheetStyle
	sheet: Sheet
	title: string
	editMode?: boolean
	onChange?: (sheetData: string, title: string) => void
}

export default function SheetDisplay(props: SheetDisplayProps) {
	const getSignature = (sheet: Sheet): signature => {
		const keyChord = sheet.getKeyChord()
		if (keyChord === undefined) return 'sharp'
		const root = keyChord?.data.rootNote.toString('sharp') as note
		const quality = keyChord?.data.quality

		if (root === 'A#') return 'flat'
		if (root === 'C' && quality === 'm') return 'flat'
		if (root === 'D' && quality === 'm') return 'flat'
		if (root === 'F') return 'flat'

		return 'sharp'
	}
	const signature: signature = getSignature(props.sheet)

	return (
		<div>
			{props.editMode ? (
				<>
					<EditSheet
						sheet={props.sheet}
						title={props.title}
						onChange={(data, title) => {
							props.onChange?.(data, title)
						}}
					/>
				</>
			) : (
				<>
					{sheetStyles[props.variant || 'default']({
						sheet: props.sheet,
						title: props.title,
						signature: signature,
					})}
				</>
			)}
		</div>
	)
}
