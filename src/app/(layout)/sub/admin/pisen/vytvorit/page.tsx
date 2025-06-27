'use client'

import { PostCreateVariantOutDto } from '@/api/generated'
import { useAdditionInfoAdminSection } from '@/app/(layout)/sub/admin/pisen/vytvorit/useAdditionInfoAdminSection'
import usePublishAdminSection from '@/app/(layout)/sub/admin/pisen/vytvorit/usePublishAdminSection'
import { useTextChordAdminSection } from '@/app/(layout)/sub/admin/pisen/vytvorit/useTextChordAdminSection'
import { useValidationAdminSection } from '@/app/(layout)/sub/admin/pisen/vytvorit/useValidationAdminSection'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Button } from '@/common/ui'
import { Step, StepLabel, Stepper } from '@/common/ui/mui'
import { useMemo, useState } from 'react'

export default SmartPage(CreateSongPage, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

export type AdminStepperItem = {
	label: string
	component: React.ReactNode
	completed?: boolean
	actions?: (cont: () => void, disabledContinue: boolean) => React.ReactNode
	disabledContinue?: boolean
}

const STEP_COUNT = 3

function CreateSongPage() {
	const [packData, setPackData] = useState<PostCreateVariantOutDto | null>(null)

	const first = useTextChordAdminSection(packData, (data) => {
		setPackData(data)
	})
	const second = useValidationAdminSection(packData!)
	const third = useAdditionInfoAdminSection(packData!)
	const fourth = usePublishAdminSection(packData!)

	const items: AdminStepperItem[] = useMemo(() => {
		return [first, second, third, fourth]
	}, [first, second])

	const [step, setStep] = useState(0)
	const nextStep = () => {
		setStep((prev) => prev + 1)
	}
	const prevStep = () => {
		setStep((prev) => prev - 1)
	}

	return (
		<Box display={'flex'} flexDirection={'column'} gap={2} minHeight={'100%'}>
			<Stepper activeStep={step}>
				{items.map((item, index) => (
					<Step key={index} completed={item.completed}>
						<StepLabel>{item.label}</StepLabel>
					</Step>
				))}
			</Stepper>
			{items[step]?.component || <Box>Neznámý krok</Box>}
			<Box flex={1} />
			<Box display={'flex'} gap={2} justifyContent={'space-between'}>
				<Button onClick={prevStep} disabled={step === 0} outlined>
					Předchozí
				</Button>

				{items[step]?.actions ? (
					items[step]?.actions(nextStep, items[step]?.disabledContinue || false)
				) : (
					<>
						<Button onClick={nextStep} disabled={items[step]?.disabledContinue}>
							Pokračovat
						</Button>
					</>
				)}

				{/* {step === 0 ? (
					<Box
						sx={{
							display: 'flex',
							gap: 1,
						}}
					>
						<Button
							onClick={onOnlySaveClick}
							variant="outlined"
							disabled={!isSheetValid}
							loading={apiState.loading}
						>
							Uložit píseň
						</Button>
						<Button
							onClick={onSaveAndContinue}
							disabled={!isSheetValid}
							loading={apiState.loading}
						>
							Uložit a pokračovat
						</Button>
					</Box>
				) : step < STEP_COUNT - 1 ? (
					<Button onClick={nextStep} loading={apiState.loading}>
						pokračovat
					</Button>
				) : (
					<Button loading={apiState.loading} onClick={onPublishClick}>
						Zveřejnit
					</Button>
				)} */}
			</Box>
		</Box>
	)
}
