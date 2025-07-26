import { PackGuid } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import CreatorAutoComplete from '@/common/components/creators/CreatorAutoComplete'
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
	const { songCreatorsApi, songEditingApi } = useApi()
	const [language, setLanguage] = useState<SongLanguage>('cs')
	const [autoFound, setAutoFound] = useState<boolean>(false)

	const [creators, setCreators] = useState<string[]>([])

	const handleChange = (event: SelectChangeEvent) => {
		setLanguage(event.target.value)
		setAutoFound(false)
	}

	const { fetchApiState, apiState } = useApiState()

	const onClick = async () => {
		await fetchApiState(async () => {
			await songEditingApi.changeLanguage({
				packGuid: packData.packGuid as PackGuid,
				languageString: language as string,
			})

			await songCreatorsApi.setToPack({
				packGuid: packData.packGuid as PackGuid,
				creators: creators,
			})
		})
	}
	return {
		label: 'Doprovodné informace',
		actions: (cont, disabledContinue) => (
			<Button
				onClick={async () => {
					await onClick()
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

							<CreatorAutoComplete onChange={setCreators} />
							{/* <InterpretField /> */}
						</div>
					</>
				)}
			</Box>
		),
	}
}
