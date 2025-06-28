import { mapExtendedVariantPackApiToDto } from '@/api/dtos'
import { PostCreateVariantOutDto, ValidationResult } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import { Box, Button, Gap, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { useApiStateEffect } from '@/tech/ApiState'
import { Toys } from '@mui/icons-material'
import { useState } from 'react'

export const useValidationAdminSection = (
	variantData: PostCreateVariantOutDto
): AdminStepperItem => {
	const {
		songValidationApi,
		songGettingApi,
		songPublishingApi,
		songEditingApi,
	} = useApi()
	const [validation, setValidation] = useState<ValidationResult>()
	const [qualities, setQualities] = useState<any>()

	// const a = useInner

	const [apiState] = useApiStateEffect(async () => {
		const aliasString = variantData.alias

		const data =
			await songGettingApi.songOneGettingControllerGetVariantDataByAlias(
				aliasString
			)
		const variant = mapExtendedVariantPackApiToDto(data.main)

		const validation =
			await songValidationApi.songValidationControllerValidateSheetDataAndTitle(
				{
					sheetData: variant.sheetData,
					title: variant.title,
				}
			)

		if (!validation) setQualities({})
		const q: { [key: string]: any } = validation.qualities

		Object.keys(q).forEach((element) => {
			if (!q[element]) q[element] = undefined
		})

		setQualities({ ...q })

		setValidation(validation)
	}, [variantData])
	const theme = useTheme()
	return {
		label: 'Validace obsahu',
		actions: (cont, disabledContinue) => (
			<Button onClick={cont} disabled={disabledContinue}>
				Pokračovat
			</Button>
		),
		disabledContinue:
			!apiState.success || apiState.loading || !validation?.success,
		component: (
			<>
				<Box display={'flex'} flexDirection={'column'} gap={2}>
					{!validation || apiState.loading ? (
						<>
							<Typography>
								<Toys fontSize="small" />
								Probíhá validace...
							</Typography>
						</>
					) : validation.success ? (
						<Box
							sx={{
								borderColor: 'success.main',
								borderStyle: 'solid',
								borderRadius: 2,
								padding: 2,
								bgcolor: alpha(theme.palette.success.main, 0.05),
							}}
						>
							<Typography strong variant="h6">
								Vše v pořádku. Formát je validní
							</Typography>

							<Typography small>Můžeš pokračovat dál.</Typography>
						</Box>
					) : (
						<Box
							sx={{
								borderColor: 'error.main',
								borderStyle: 'solid',
								borderRadius: 2,
								padding: 2,
								bgcolor: alpha(theme.palette.error.main, 0.05),
							}}
						>
							<Typography strong variant="h6">
								Nevalidní formát ke zveřejnění
							</Typography>

							<Typography small>{validation.message || ''}</Typography>
							<Gap />
							{Object.entries(qualities)
								.filter(([key, value]) => value)
								.map(([key, value], index) => (
									<Box key={key}>
										<Typography>
											{index + 1}. {key}
										</Typography>
									</Box>
								))}
						</Box>
					)}
				</Box>
			</>
		),
	}
}
