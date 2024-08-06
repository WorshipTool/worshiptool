'use client'
import { CreatedType } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { CloudUpload } from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	Paper,
	Typography,
	useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Gap } from '../../../../common/ui/Gap'
import { useApi } from '../../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useSmartParams } from '../../../../routes/useSmartParams'
import { useApiState } from '../../../../tech/ApiState'
import { handleApiCall } from '../../../../tech/handleApiCall'
import SheetListPreview from '../components/SheetListPreview'
import UploadedSongList from '../components/UploadedSongList/UploadedSongList'
import useImport from '../hooks/useImport'
import { EasySheet } from '../page'

const parsingMessages = [
	'Nahrávám soubor...',
	'Zpracovávám soubor...',
	'Snažím se přečíst soubor...',
	'Hledám píseň ve vašem souboru...',
]

const uploadingMessages = [
	'Nahrávám píseň...',
	'Přidávám píseň do databáze...',
	'Ukládám píseň...',
	'Ukládám píseň do databáze...',
]

export default SmartPage(Parse)
function Parse() {
	const { files } = useSmartParams('uploadParse')

	const [parsed, setParsed] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [loadingMessage, setLoadingMessage] = React.useState('')

	const [sheets, setSheets] = React.useState<EasySheet[]>([])
	const [uploading, setUploading] = React.useState(false)
	const [uploadingMessage, setUploadingMessage] = React.useState('')
	const [uploaded, setUploaded] = useState(false)
	const [uploadedSongs, setUploadedSongs] = useState<
		{
			title: string
			guid: string
		}[]
	>([])
	const { songAddingApi } = useApi()

	// const {post, loading:fetching} = useFetch();
	const upload = useImport()
	const navigate = useSmartNavigate()

	const {
		fetchApiState,
		apiState: { loading: fetching },
	} = useApiState<PostCreateVariantOutDto>()

	const startParsing = async (files: File[]) => {
		setLoading(true)
		setUploaded(false)

		const sheets: EasySheet[] = []
		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			const message =
				parsingMessages[Math.floor(Math.random() * parsingMessages.length)] +
				'\t' +
				(i + 1) +
				'/' +
				files.length
			setLoadingMessage(message)
			const data = await upload(file)
			const sheetsData = data.sheets
			sheetsData.forEach((sheetData) => {
				sheets.push({
					title: sheetData.title,
					data: sheetData.data,
					randomHash: Math.random().toString(36).substring(7),
					originalFile: file,
				})
			})
		}
		setLoadingMessage('Rozluštěno')
		setSheets(sheets)
		setTimeout(() => {
			setLoading(false)
			setParsed(true)
		}, 500)
	}

	const uploadSheets = async () => {
		setUploading(true)
		setUploaded(false)

		const guids: string[] = []
		for (let i = 0; i < sheets.length; i++) {
			const message =
				uploadingMessages[
					Math.floor(Math.random() * uploadingMessages.length)
				] +
				'\t' +
				(i + 1) +
				'/' +
				sheets.length

			setUploadingMessage(message)

			const sheet = sheets[i]

			fetchApiState(
				async () => {
					return await handleApiCall(
						songAddingApi.songAddingControllerCreate({
							title: sheet.title,
							sheetData: sheet.data,
							createdType: CreatedType.Parsed,
						})
					)
				},
				(data) => {
					guids.push(data.variant.guid)
					setUploadingMessage('Hotovo')
					setTimeout(() => {
						setUploadedSongs(
							guids.map((guid, i) => {
								return {
									title: sheets[i].title,
									guid: guid,
								}
							})
						)
						setUploading(false)
						setUploaded(true)
					}, 2000)
				}
			)
		}
	}

	useEffect(() => {
		if (files) {
			startParsing(files.map((f) => new File([], f)))
		}
	}, [files])

	const theme = useTheme()

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 5,
				}}
			>
				{!loading ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{!uploaded ? (
							<>
								{!uploading ? (
									<>
										{sheets.length > 0 ? (
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													justifyContent: 'center',
													padding: 2,
												}}
											>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<Box flex={1}>
														<Typography variant="subtitle2">
															Zkontrolujte, zda bylo vše správně načteno...
														</Typography>
													</Box>
													<Gap horizontal />
													<Box
														sx={{
															[theme.breakpoints.down('md')]: {
																display: 'none',
															},
														}}
													>
														<Button
															variant="contained"
															size="large"
															endIcon={<CloudUpload />}
															onClick={uploadSheets}
														>
															<Typography variant="button">
																Ano, vše je v pořádku
															</Typography>
														</Button>
													</Box>
													<Box
														sx={{
															[theme.breakpoints.up('md')]: {
																display: 'none',
															},
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'end',
															alignItems: 'center',
														}}
														flex={1}
													>
														<Button
															variant="contained"
															size="large"
															onClick={uploadSheets}
														>
															<Typography variant="button">
																Vše v pořádku
															</Typography>
														</Button>
													</Box>
												</Box>
												<Gap />
												<SheetListPreview
													sheets={sheets}
													onChange={(sheets) => {
														setSheets(sheets)
														if (sheets.length === 0) {
															setParsed(false)
														}
													}}
												/>
											</Box>
										) : (
											<>
												<Box
													sx={{
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'center',
														alignItems: 'center',
													}}
												>
													<Typography variant="subtitle2">
														Nenašli jsme žádné písně.
													</Typography>
													<Gap value={2} />
													<Button
														variant="contained"
														size="large"
														endIcon={<CloudUpload />}
														onClick={() => {
															navigate('upload', {})
														}}
													>
														<Typography variant="button">
															Zkusit jinou fotku
														</Typography>
													</Button>
												</Box>
											</>
										)}
									</>
								) : (
									<>
										<Box
											sx={{
												height: 200,
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'end',
											}}
										>
											<CircularProgress />
											<Gap />
											<Typography variant="subtitle2">
												{uploadingMessage}
											</Typography>
										</Box>
									</>
								)}
							</>
						) : (
							<>
								<UploadedSongList songs={uploadedSongs} />
								<Gap />
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'end',
									}}
								>
									<Button
										variant="contained"
										onClick={() => {
											navigate('upload', {})
										}}
									>
										Nahrát další
									</Button>
								</Box>
								<Gap value={2} />
							</>
						)}
					</Box>
				) : (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Paper
							sx={{
								width: 360,
								height: 330,
								borderRadius: 5,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								userSelect: 'none',
								bgcolor: 'grey.100',
								border: '0px solid',
							}}
						>
							<Box
								sx={{
									display: 'block',
								}}
							>
								<CircularProgress />
							</Box>

							{loading && (
								<Box>
									<Gap value={4} />
									<Typography>{loadingMessage || 'Nahrávání'}</Typography>
								</Box>
							)}
						</Paper>
					</Box>
				)}
			</Box>
		</>
	)
}
