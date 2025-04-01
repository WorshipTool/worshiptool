// This component has to be as most basic as possible, no hooks, only client imports, apod.
// for default setting, of course
import HandleCopyProvider from '@/common/components/SheetDisplay/components/HandleCopyProvider'
import { Sheet } from '@pepavlin/sheet-api'
import { note, signature } from '@pepavlin/sheet-api/lib/models/note'
import EditSheet from './components/EditSheet'
import { SheetStyle, sheetStyles } from './styles/config'

interface SheetDisplayProps {
	// Type of variant is keys of sheetStyles
	columns?: number
	variant?: SheetStyle
	sheet: Sheet
	title?: string
	editMode?: boolean
	hideChords: boolean
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
						title={props.title || ''}
						onChange={(data, title) => {
							props.onChange?.(data, title)
						}}
					/>
				</>
			) : (
				<HandleCopyProvider>
					{props.hideChords
						? sheetStyles[props.variant || 'default']({
								sheet: props.sheet,
								title: props.title,
								signature: signature,
								columns: props.columns || 1,
								hideChords: true,
						  })
						: sheetStyles[props.variant || 'default']({
								sheet: props.sheet,
								title: props.title,
								signature: signature,
								columns: props.columns || 1,
								hideChords: false,
						  })}
				</HandleCopyProvider>
			)}
		</div>
	)
}
