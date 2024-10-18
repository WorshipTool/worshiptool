'use client'
import { CreateTeamOutDto } from '@/api/generated'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useState } from 'react'

export default function CreateTeamButton() {
	// Popup
	const [popupOpen, setPopupOpen] = useState(false)

	// Apis
	const { teamAddingApi } = useApi()
	const { apiState, fetchApiState } = useApiState<CreateTeamOutDto>()

	// Input states
	const [teamName, setTeamName] = useState('')

	const navigate = useSmartNavigate()

	const onClick = () => {
		setPopupOpen(true)
	}

	const onCancel = () => {
		setPopupOpen(false)
		setTeamName('')
	}

	const onCreateClick = () => {
		fetchApiState(
			() =>
				handleApiCall(
					teamAddingApi.teamAddingControllerCreateNewTeam({
						teamName,
					})
				),
			(data) => {
				navigate('team', {
					alias: data.alias,
				})
			}
		)
	}

	return (
		<>
			<Popup
				open={popupOpen}
				onSubmit={onCreateClick}
				onClose={() => setPopupOpen(false)}
				onReset={onCancel}
				width={300}
				title="Vytvořit tým"
				subtitle={'Vytvořte soukromý tým'}
				actions={
					<>
						<Button
							title="Zrušit"
							color="grey.700"
							// size="small"
							variant="text"
							type="reset"
						/>
						<Button
							title="Vytvořit"
							color="primary"
							// size="small"
							loading={apiState.loading}
							type="submit"
						/>
					</>
				}
			>
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<TextField
						placeholder="Zadejte název týmu"
						value={teamName}
						onChange={setTeamName}
						autoFocus
						sx={{
							bgcolor: 'grey.100',
							padding: 1,
							borderRadius: 1,
							border: `1px solid ${grey[300]}`,
						}}
					/>
					{apiState.error && (
						<>
							<Typography color="error">
								Nastala chyba. Prosím, zkontrolujte název týmu
							</Typography>
						</>
					)}
				</Box>
			</Popup>
			<Button
				title="Vyzkoušet"
				subtitle="Vytvořit tým"
				color="secondary"
				sx={{
					width: 150,
				}}
				onClick={onClick}
			/>
		</>
	)
}
