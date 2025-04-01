import DefaultStylePreview from '@/common/components/SheetDisplay/styles/DefaultStylePreview'
import PrintCompactStyle from '@/common/components/SheetDisplay/styles/PrintCompactStyle'
import SmartStyle from '@/common/components/SheetDisplay/styles/SmartStyle'
import { Sheet } from '@pepavlin/sheet-api'
import { signature } from '@pepavlin/sheet-api/lib/models/note'
import DefaultStyle from './DefaultStyle'
import ExperimentalStyle from './ExperimentalStyle'
import ModernStyle from './ModernStyle'

export type SheetStyle =
	| 'default'
	| 'default-preview'
	| 'experimental'
	| 'modern'
	| 'printCompact'
	| 'smart'
export interface SheetStyleComponentProps {
	sheet: Sheet
	title?: string
	signature?: signature
	columns: number
	hideChords: boolean
}
export type SheetStyleComponentType = (
	props: SheetStyleComponentProps
) => JSX.Element

export const sheetStyles: { [style in SheetStyle]: SheetStyleComponentType } = {
	['default']: DefaultStyle,
	['experimental']: ExperimentalStyle,
	['modern']: ModernStyle,
	['printCompact']: PrintCompactStyle,
	['smart']: SmartStyle,
	['default-preview']: DefaultStylePreview,
}
