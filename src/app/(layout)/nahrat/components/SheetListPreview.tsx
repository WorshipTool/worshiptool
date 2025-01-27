import { Box } from '@/common/ui'
import React, { useEffect } from 'react'
import UploadSheetEditable from './UploadSheetEditable'
export interface EasySheet {
	title: string
	data: string
	randomHash: string
	originalFile: File
}

interface SheetListPreviewProps {
	sheets: EasySheet[]
	onChange: (sheets: EasySheet[]) => void
}

export default function SheetListPreview(props: SheetListPreviewProps) {
	const [sheets, setSheets] = React.useState<EasySheet[]>(props.sheets)

	useEffect(() => {
		setSheets(props.sheets)
	}, [props.sheets])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'wrap',
			}}
		>
			{sheets.map((sheet, index) => {
				return (
					<div key={'sheet' + sheet.randomHash}>
						<UploadSheetEditable
							title={sheet.title}
							data={sheet.data}
							onDelete={() => {
								const newSheets = [...props.sheets]
								newSheets.splice(index, 1)
								props.onChange(newSheets)
							}}
							onChange={(title, data) => {
								const newSheets = [...props.sheets]
								newSheets[index].title = title
								newSheets[index].data = data
								props.onChange(newSheets)
							}}
							originalFile={sheet.originalFile}
						></UploadSheetEditable>
					</div>
				)
			})}
		</Box>
	)
}
