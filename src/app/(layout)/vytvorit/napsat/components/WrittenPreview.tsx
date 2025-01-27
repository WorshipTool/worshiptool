import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Sheet } from '@pepavlin/sheet-api'

type WrittenPreviewProps = {
	title: string
	sheet: Sheet
}

export default function WrittenPreview({ title, sheet }: WrittenPreviewProps) {
	return (
		<SheetDisplay title={title} sheet={sheet} columns={1} hideChords={false} />
	)
}
