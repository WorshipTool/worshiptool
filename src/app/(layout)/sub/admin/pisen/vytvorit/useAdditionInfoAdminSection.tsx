import { PackGuid } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import InterpretField from '@/app/(layout)/sub/admin/pisen/vytvorit/components/InterpretField'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import { Box, Button, Typography } from '@/common/ui'
import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@/common/ui/mui'
import { useApiState } from '@/tech/ApiState'
import { SongLanguage } from '@/types/song'
import { useState } from 'react'

export const useAdditionInfoAdminSection = (
	packData: PostCreateVariantOutDto
): AdminStepperItem => {
	const {
		songValidationApi,
		songGettingApi,
		songPublishingApi,
		songEditingApi,
	} = useApi()
	const [language, setLanguage] = useState<SongLanguage>('cs')
	const [autoFound, setAutoFound] = useState<boolean>(false)

	const handleChange = (event: SelectChangeEvent) => {
		setLanguage(event.target.value)
		setAutoFound(false)
	}

	const { fetchApiState, apiState } = useApiState()
	return {
		label: 'Doprovodné informace',
		actions: (cont, disabledContinue) => (
			<Button
				onClick={async () => {
					await fetchApiState(async () => {
						await songEditingApi.changeLanguage({
							packGuid: packData.variant.historyPack.guid as PackGuid,
							languageString: language as string,
						})
					})

					cont()
				}}
				disabled={disabledContinue}
			>
				Pokračovat
			</Button>
		),
		disabledContinue: apiState.loading,
		component: (
			<Box>
				<Typography>Jazyk písně:</Typography>

				{false ? (
					<>
						<Typography>Probíhá zjišťování jazyka...</Typography>
					</>
				) : (
					<>
						{autoFound && (
							<Typography strong>{'- Zjištěno automaticky'}</Typography>
						)}
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 10,
							}}
						>
							<FormControl
								sx={{
									width: 200,
								}}
							>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={language as string}
									// label="Jazyk"
									onChange={handleChange}
									size="small"
								>
									<MenuItem value={'cs'}>Čeština</MenuItem>
									<MenuItem value={'sk'}>Slovenština</MenuItem>
									<MenuItem value={'en'}>Angličtina</MenuItem>
								</Select>
							</FormControl>
							<InterpretField />
						</div>
					</>
				)}
			</Box>
		),
	}
}
