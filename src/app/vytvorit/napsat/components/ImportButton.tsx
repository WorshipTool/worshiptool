import { FileUpload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useRef, useState } from 'react'
import useImport from '../../../nahrat/hooks/useImport'

interface ImportButtonProps {
	onLoad?: (title: string, sheetData: string) => void
}

export default function ImportButton({ onLoad }: ImportButtonProps) {
	const importImage = useImport()
	const inputRef = useRef(null)

	const [inProgress, setInProgress] = useState(false)

	const onClick = () => {
		//@ts-ignore
		inputRef.current.click()
	}

	const handleFileChange = async (e: any) => {
		const file = e.target.files[0]
		if (!file) return
		setInProgress(true)
		await importImage(file).then((data) => {
			const sheets = data.sheets
			if (sheets.length === 0) {
				console.log('No sheets found')
			} else {
				const sheet = sheets[0]
				if (onLoad) onLoad(sheet.title, sheet.data)
			}
		})
		setInProgress(false)
	}

	return (
		<>
			<input
				style={{ display: 'none' }}
				ref={inputRef}
				type="file"
				onChange={handleFileChange}
			/>
			<LoadingButton
				variant="contained"
				onClick={onClick}
				loading={inProgress}
				size="small"
				startIcon={<FileUpload />}
			>
				Importovat
			</LoadingButton>
		</>
	)
}
