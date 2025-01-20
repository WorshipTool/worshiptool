'use client'
import { BACKEND_URL } from '@/api/constants'
import {
	ParserApiAxiosParamCreator,
	ParserSongDataResult,
} from '@/api/generated'
import AdminOption from '@/common/components/admin/AdminOption'
import Popup from '@/common/components/Popup/Popup'
import { Box, Button, LinearProgress, Typography } from '@/common/ui'
import { Chip } from '@/common/ui/mui'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { copyToClipboard } from '@/tech/string/copy.tech'
import {
	AutoAwesome,
	CameraEnhance,
	ContentCopy,
	MenuOpen,
} from '@mui/icons-material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const INPUT_ID = 'parse-image-admin-input'
export default function ParseAdminOption() {
	const { isAdmin, user, apiConfiguration } = useAuth()
	const onClick = () => {
		//open file input
		const input = document.getElementById(INPUT_ID)
		if (input) {
			input.click()
		}
	}

	const [open, setOpen] = useState(false)
	const [files, setFiles] = useState<File[] | null>(null)

	const { fetchApiState, apiState } = useApiState<ParserSongDataResult>()
	const { parserApi } = useApi()
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isAdmin()) {
			throw new Error('User is not admin')
			return
		}

		const fileList = e.target.files
		if (!fileList) {
			console.log('No files selected')
			return
		}
		const files = Array.from(fileList)
		setFiles(files)
		setOpen(true)

		fetchApiState(async () => parse(files))
	}

	const parse = async (files: File[]) => {
		const a = await ParserApiAxiosParamCreator(apiConfiguration)
		const parse = await a.parserControllerParse()
		const urlObject = new URL(parse.url, BACKEND_URL)
		const url = urlObject.toString()

		const form = new FormData()

		for (let i = 0; i < files.length; i++) {
			form.append('file', files[i], files[i].name)
		}

		const result: ParserSongDataResult = await handleApiCall(
			axios(url, {
				...parse.options,
				method: 'POST',
				data: form,
			})
		)

		return result
	}

	const { enqueueSnackbar } = useSnackbar()

	const copy = (sheet: ParserSongDataResult['sheets'][0]) => {
		const data = sheet.data
		copyToClipboard(data)

		enqueueSnackbar('Data písně zkopírovány.')
	}

	return (
		<>
			<AdminOption
				title="Parsovat soubor"
				subtitle="Vybrat soubor ke zpracování"
				icon={<CameraEnhance />}
				onClick={onClick}
			/>

			<div
				style={{
					display: 'none',
				}}
			>
				<input
					type="file"
					accept="image/*"
					multiple
					onChange={onChange}
					id={INPUT_ID}
				/>
			</div>

			<Popup
				open={open}
				onClose={() => setOpen(false)}
				width={400}
				title={
					apiState.loading ? (
						'Zpracovávání souborů'
					) : (
						<Box display={'flex'} gap={1}>
							Zpracováno
							{apiState.data?.usedAi && (
								<>
									<Chip
										label={'S pomocí AI'}
										size="small"
										color="success"
										icon={<AutoAwesome />}
									/>
								</>
							)}
						</Box>
					)
				}
			>
				{apiState.loading ? (
					<>
						<LinearProgress />
					</>
				) : (
					<Box>
						<Box
							display={'flex'}
							flexDirection={'column'}
							gap={1}
							maxHeight={500}
							overflow={'auto'}
						>
							{apiState.data?.sheets.map((a) => {
								return (
									<Box
										sx={{
											bgcolor: 'grey.100',
											padding: 2,
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'grey.200',
											display: 'flex',
											flexDirection: 'column',
											gap: 1,
										}}
									>
										<Typography strong>{a.title}</Typography>

										<Box>
											{a.data.split('\n').map((line) => {
												return (
													<Typography
														sx={{
															minHeight: '1.2rem',
														}}
													>
														{line}
													</Typography>
												)
											})}
										</Box>
										<Box display={'flex'} justifyContent={'flex-end'}>
											<Button
												size="small"
												variant="text"
												color="grey.700"
												startIcon={<ContentCopy />}
												onClick={() => copy(a)}
											>
												Zkopírovat
											</Button>
										</Box>
									</Box>
								)
							})}
						</Box>
					</Box>
				)}
			</Popup>

			{apiState.data && (
				<AdminOption
					icon={<MenuOpen />}
					title="Otevřít zpracovaná data"
					onClick={() => setOpen(true)}
					notify
				/>
			)}
		</>
	)
}
