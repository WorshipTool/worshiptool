'use client'
import { CreatedType, VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Button, Tooltip, Typography } from '@/common/ui'
import { InputBase, Switch, styled } from '@/common/ui/mui'
import { parseVariantAlias } from '@/routes/routes.tech'
import CircularProgress from '@mui/material/CircularProgress'
import { Sheet } from '@pepavlin/sheet-api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ContainerGrid from '../../../../common/components/ContainerGrid'
import DefaultStyle from '../../../../common/components/SheetDisplay/styles/DefaultStyle'
import { Gap } from '../../../../common/ui/Gap'
import { useApi } from '../../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../tech/ApiState'
import { handleApiCall } from '../../../../tech/handleApiCall'
import { isSheetDataValid } from '../../../../tech/sheet.tech'
import ToolPanel from './ToolPanel'
import NotValidWarning from './components/NotValidWarning'

const StyledContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.grey[100],
	boxShadow: `0px 0px 5px ${theme.palette.grey[400]}`,
	display: 'flex',
}))

const TitleInput = styled(InputBase)(({ theme }) => ({
	fontWeight: theme.typography.fontWeightBold,
}))
const SheetInput = styled(InputBase)(({}) => ({
	minHeight: 200,
	justifyContent: 'start',
	alignItems: 'start',
}))

export default SmartPage(Create)
function Create() {
	const { songAddingApi } = useApi()
	const {
		fetchApiState,
		apiState: { loading: posting, error },
	} = useApiState<PostCreateVariantOutDto>()

	const [preview, setPreview] = useState(false)

	const sheetInputRef: any = useRef(null)
	const titleInputRef: any = useRef(null)

	const [title, setTitle] = useState('')
	const [sheetData, setSheetData] = useState('')

	const navigate = useSmartNavigate()

	const [sheet, setSheet] = useState<Sheet>(new Sheet(sheetData))

	const isSheetValid = useMemo(() => {
		return isSheetDataValid(sheetData)
	}, [sheetData])

	useEffect(() => {
		setSheet(new Sheet(sheetData))
	}, [sheetData])

	const onPostClick = () => {
		fetchApiState(
			async () => {
				return handleApiCall(
					songAddingApi.songAddingControllerCreate({
						title,
						sheetData,
						createdType: CreatedType.Manual,
					})
				)
			},
			(result) => {
				const a = parseVariantAlias(result.alias as VariantPackAlias)
				navigate(
					'variant',
					{
						hex: a.hex,
						alias: a.alias,
					},
					{
						replace: false,
					}
				)
			}
		)
	}

	const newSection = (name: string) => {
		const target = sheetInputRef.current
		let textToInsert = `{${name}}`
		let cursorPosition = target.selectionStart
		let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
		let textAfterCursorPosition = target.value.substring(
			cursorPosition,
			target.value.length
		)
		setSheetData(
			textBeforeCursorPosition + textToInsert + textAfterCursorPosition
		)
		target.focus()
	}

	const newChord = () => {
		const target = sheetInputRef.current
		let textToInsert = '[C]'
		let cursorPosition = target.selectionStart
		let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
		let textAfterCursorPosition = target.value.substring(
			cursorPosition,
			target.value.length
		)
		setSheetData(
			textBeforeCursorPosition + textToInsert + textAfterCursorPosition
		)
		target.focus()
	}

	const keysHandler = useCallback((event: any) => {
		if (event.altKey === true) {
			if (event.key === 'c') {
				newChord()
			}

			if (event.key === 'v') {
				newSection('V')
			}
			if (event.key === 'r') {
				newSection('R')
			}
			if (event.key === 'b') {
				newSection('B')
			}
		}
	}, [])

	const onImport = (title: string, data: string) => {
		setTitle(title)
		setSheetData(data)
	}

	return (
		<>
			<Box flex={1} display={'flex'} flexDirection={'row'}>
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'start',
						alignItems: 'center',
					}}
				>
					<ContainerGrid direction="column">
						<Box display={'flex'} padding={1} paddingLeft={0}>
							<Box flex={1} display={'flex'} alignItems={'center'}>
								{/* <ImportButton onLoad={onImport}/> */}
								<Gap horizontal />
							</Box>
							<Box display={'flex'} justifyContent={'end'} padding={1}>
								<Typography
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									Náhled
								</Typography>
								<Switch
									size="small"
									checked={preview}
									onChange={(e) => {
										setPreview((p) => !p)
									}}
								/>
							</Box>
						</Box>

						{!preview ? (
							<StyledContainer>
								<Box display={'flex'} flexDirection={'column'} flex={1}>
									<TitleInput
										placeholder="Zadejte název písně"
										inputRef={titleInputRef}
										value={title}
										onChange={(e) => {
											setTitle(e.target.value)
										}}
									/>

									<SheetInput
										placeholder="Zde je místo pro obsah písně..."
										inputRef={sheetInputRef}
										multiline
										value={sheetData}
										onChange={(e) => {
											setSheetData(e.target.value)
										}}
										onKeyDown={keysHandler}
									/>
								</Box>

								<ToolPanel onNewSection={newSection} onNewChord={newChord} />
							</StyledContainer>
						) : (
							<StyledContainer flexDirection={'column'}>
								{title == '' && sheet.getSections().length == 0 && (
									<Typography sx={{ color: 'grey' }}>
										Tady uvidite ukazku...
									</Typography>
								)}
								<DefaultStyle
									title={title}
									sheet={sheet}
									columns={1}
									hideChords={false}
								/>
							</StyledContainer>
						)}

						<Gap />
						<Box display={'flex'} justifyContent={'start'}>
							<Box flex={1}>
								<Box display={'flex'}>
									<Tooltip title={'Přidat'}>
										<Button
											variant={'contained'}
											color={'primary'}
											disabled={
												posting ||
												title == '' ||
												sheetData == '' ||
												!isSheetValid
											}
											onClick={onPostClick}
										>
											Vytvořit {'(neveřejně)'}
											{posting && (
												<CircularProgress
													color={'inherit'}
													size={16}
													sx={{ marginLeft: 1 }}
												/>
											)}
										</Button>
									</Tooltip>
								</Box>
								{sheetData !== '' && !isSheetValid && <NotValidWarning />}
							</Box>
						</Box>
					</ContainerGrid>
				</Box>
			</Box>
		</>
	)
}
