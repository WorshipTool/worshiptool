'use client'
import { Box } from '@mui/material'
import { useSmartNavigate } from '../../routes/useSmartNavigate'
import UploadPanel from './components/UploadPanel/UploadPanel'

export interface EasySheet {
	title: string
	data: string
	randomHash: string
	originalFile: File
}

export default function Upload() {
	const navigate = useSmartNavigate()

	const parseFiles = async (files: File[]) => {
		navigate('uploadParse', { files: files.map((file) => file.name) })
		return
	}

	return (
		<>
			<Box
				sx={{
					width: '100%',
					height: 500,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 5,
				}}
			>
				<Box
					sx={{
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<UploadPanel onUpload={parseFiles} />
				</Box>
			</Box>
		</>
	)
}
