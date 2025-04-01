'use client'

import { CreatedType, VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import SheetEditor from '@/common/components/SheetEditor/SheetEditor'
import { Box, Button, Typography } from '@/common/ui'
import { Step, StepLabel, Stepper } from '@/common/ui/mui'
import { grey } from '@/common/ui/mui/colors'
import { useApi } from '@/hooks/api/useApi'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { isSheetDataValid } from '@/tech/sheet.tech'
import { Sheet } from '@pepavlin/sheet-api'
import { useMemo, useState } from 'react'

export default SmartPage(CreateSongPage, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

const STEP_COUNT = 2

function CreateSongPage() {
	const { songManagementApi, songAddingApi } = useApi()

	const [sheetData, setSheetData] = useState('')
	const sheet = useMemo(() => {
		return new Sheet(sheetData)
	}, [sheetData])
	const [title, setTitle] = useState('')

	const isSheetValid = useMemo(() => {
		return isSheetDataValid(sheetData)
	}, [sheet])

	const [step, setStep] = useState(0)
	const nextStep = () => {
		setStep((prev) => prev + 1)
	}
	const prevStep = () => {
		setStep((prev) => prev - 1)
	}

	const { fetchApiState, apiState } = useApiState<PostCreateVariantOutDto>()
	const navigate = useSmartNavigate()

	const onPostClick = () => {
		if (!isSheetValid) return
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
					'adminPack',
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

	return (
		<Box display={'flex'} flexDirection={'column'} gap={2} minHeight={'100%'}>
			<Stepper activeStep={step}>
				<Step key={'one'} completed={isSheetValid}>
					<StepLabel>Text a akordy</StepLabel>
				</Step>
				{/* <Step key={'two'}>
					<StepLabel>Doprovodné informace</StepLabel>
				</Step> */}
				<Step key={'three'}>
					<StepLabel>Zveřejnění</StepLabel>
				</Step>
			</Stepper>
			{step === 0 ? (
				<>
					<Box
						sx={{
							display: 'flex',
							bgcolor: 'grey.100',
							padding: 3,
							backgroundColor: 'grey.100',
							boxShadow: `0px 0px 5px ${grey[400]}`,
							gap: 3,
						}}
					>
						<SheetEditor
							onSheetDataChange={(s) => setSheetData(s)}
							onTitleChange={(t) => setTitle(t)}
							startSheetData={sheetData}
							startTitle={title}
						/>
						<Box
							flex={1}
							sx={{
								bgcolor: 'grey.200',
								padding: 3,
								borderRadius: 2,
							}}
						>
							<SheetDisplay sheet={sheet} title={title} hideChords={false} />
						</Box>
					</Box>
					{!isSheetValid && (
						<Typography color="grey.500" strong>
							Píseň není validní.
						</Typography>
					)}
				</>
			) : (
				// : step === 1 ? (
				// 	<>informace</>
				// )
				<>Pro zveřejnění klikni na tlačítko dole</>
			)}

			<Box flex={1} />

			<Box display={'flex'} gap={2} justifyContent={'space-between'}>
				<Button onClick={prevStep} disabled={step === 0} outlined>
					Předchozí
				</Button>
				{step < STEP_COUNT - 1 ? (
					<Button onClick={nextStep}>Pokračovat</Button>
				) : (
					<Button
						loading={apiState.loading}
						onClick={onPostClick}
						disabled={!isSheetValid}
					>
						Zveřejnit
					</Button>
				)}
			</Box>
		</Box>
	)
}
