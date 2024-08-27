'use client'
import { CreateTeamOutDto } from '@/api/generated'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'
import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { useState } from 'react'

export default function CreateTeamButton() {
	const [popupOpen, setPopupOpen] = useState(false)

	const { teamAddingApi } = useApi()

	const { apiState, fetchApiState } = useApiState<CreateTeamOutDto>()

	const navigate = useSmartNavigate()

	const onClick = () => {
		setPopupOpen(true)
	}

	const onCancel = () => {
		setPopupOpen(false)
	}

	const onCreateClick = () => {
		fetchApiState(
			() => handleApiCall(teamAddingApi.teamAddingControllerCreateNewTeam()),
			(data) => {
				navigate('team', {
					alias: data.alias,
				})
			}
		)
	}

	return (
		<>
			<Popup open={popupOpen} onClose={() => setPopupOpen(false)}>
				<Box width={200}>
					<Typography variant="h5">Vytvořit tým</Typography>
					<Gap />
					<TextField placeholder="Zadejte název týmu" />
					<Gap />
					<Box
						display={'flex'}
						flexDirection={'row'}
						gap={1}
						justifyContent={'space-between'}
					>
						<Button
							title="Zrušit"
							color="inherit"
							size="small"
							onClick={onCancel}
						/>
						<Button
							title="Vytvořit"
							color="primary"
							size="small"
							onClick={onCreateClick}
						/>
					</Box>
				</Box>
			</Popup>
			<Button
				title="Vyzkoušet"
				subtitle="Vytvořit tým"
				color="secondary"
				sx={{
					width: 150,
				}}
				loading={apiState.loading}
				onClick={onClick}
			/>
		</>
	)
}
