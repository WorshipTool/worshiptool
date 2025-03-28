'use client'
import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import { Button } from '@/common/ui'
import { copyToClipboard } from '@/tech/string/copy.tech'
import { CopyAll } from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { enqueueSnackbar } from 'notistack'

export default function AdminCopySheetDataButton() {
	const { sheetData } = useInnerPack()
	const onCopyClick = () => {
		const sheet = new Sheet(sheetData)
		const data = sheet.getOriginalSheetData()

		copyToClipboard(data)

		enqueueSnackbar('Data písně byla zkopírována do schránky')
	}
	return (
		<Button
			onClick={onCopyClick}
			small
			startIcon={<CopyAll />}
			outlined
			sx={{
				width: 'fit-content',
			}}
		>
			Kopírovat data písně
		</Button>
	)
}
