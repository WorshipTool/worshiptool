'use client'
import { CreatedType, VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import ToolPanel from '@/app/(layout)/vytvorit/napsat/components/ToolPanel'
import WrittenPreview from '@/app/(layout)/vytvorit/napsat/components/WrittenPreview'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Box, Button, Tooltip } from '@/common/ui'
import { InputBase, styled } from '@/common/ui/mui'
import { parseVariantAlias } from '@/routes/routes.tech'
import CircularProgress from '@mui/material/CircularProgress'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ContainerGrid from '../../../../common/components/ContainerGrid'
import { Gap } from '../../../../common/ui/Gap'
import { useApi } from '../../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../tech/ApiState'
import { handleApiCall } from '../../../../tech/handleApiCall'
import { isSheetDataValid } from '../../../../tech/sheet.tech'
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

	const sheetInputRef: any = useRef(null)
	const titleInputRef: any = useRef(null)

	const [title, setTitle] = useState('')
	const [sheetData, setSheetData] = useState('')

	const cursorRef = useRef<{ start: number; end: number } | null>() // Ref pro uchování pozice kurzoru

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

		const pos = target.selectionEnd + textToInsert.length
		cursorRef.current = {
			start: pos,
			end: pos,
		}
	}

	const newChord = () => {
		const target = sheetInputRef.current
		if (!target) return

		const textToInsert = '[C]'
		const cursorPosition = target.selectionStart
		const textBefore = sheetData.substring(0, cursorPosition)
		const textAfter = sheetData.substring(cursorPosition)
		const newValue = textBefore + textToInsert + textAfter

		setSheetData(newValue)

		// Nastavení pozice kurzoru na 'C'
		cursorRef.current = {
			start: cursorPosition + 1, // Pozice 'C'
			end: cursorPosition + 2, // Za 'C'
		}
	}

	useLayoutEffect(() => {
		if (cursorRef.current !== null) {
			const target = sheetInputRef.current
			if (cursorRef.current)
				target.setSelectionRange(cursorRef.current.start, cursorRef.current.end)
			target.focus()
			cursorRef.current = null // Resetování ref po nastavení kurzoru
		}
	}, [sheetData])

	const isSmall = useDownSize('sm')

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
					<ContainerGrid
						direction="column"
						sx={{
							marginTop: 4,
						}}
					>
						<StyledContainer
							sx={{
								display: 'flex',
								flexDirection: isSmall ? 'column' : 'row',
								gap: 1,
							}}
						>
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
								/>
								<Box flex={1} />
								<ToolPanel onNewSection={newSection} onNewChord={newChord} />
							</Box>
							<Box
								flex={1}
								sx={{
									bgcolor: 'grey.200',
									padding: 3,
									borderRadius: 2,
								}}
							>
								<WrittenPreview sheet={sheet} title={title} />
							</Box>

							{/* <ToolPanel onNewSection={newSection} onNewChord={newChord} /> */}
						</StyledContainer>

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
