'use client'
import { Box } from '@/common/ui'
import { InputBase, styled } from '@/common/ui/mui'
import { Sheet } from '@pepavlin/sheet-api'
import React from 'react'

interface EditSheetProps {
	sheet: Sheet
	title: string
	onChange: (sheetData: string, title: string) => void
}

const StyledInput = styled(InputBase)(({ theme }) => ({
	backgroundColor: theme.palette.grey[300],
	padding: 5,
}))

export default function EditSheet(props: EditSheetProps) {
	const [sheetData, setSheetData] = React.useState(
		props.sheet.getOriginalSheetData()
	)
	const [title, setTitle] = React.useState(props.title)

	const onChange = (data: string, title: string) => {
		props.onChange(data, title)
	}
	return (
		<Box
			sx={{
				display: 'flex',
				padding: 2,
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<StyledInput
				placeholder="Název písně"
				value={title}
				onChange={(e) => {
					setTitle(e.target.value)
					onChange(sheetData, e.target.value)
				}}
			/>
			<StyledInput
				placeholder="Obsah písně"
				value={sheetData}
				multiline
				onChange={(e) => {
					setSheetData(e.target.value)
					onChange(e.target.value, title)
				}}
			/>
		</Box>
	)
}
