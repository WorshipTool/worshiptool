'use client'
import { JoinTeamOutDto } from '@/api/generated'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { TextInput } from '@/common/ui/TextInput'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

export default function JoinGroupPanel() {
	const [open, setOpen] = useState(false)
	const { teamJoiningApi } = useApi()

	const [joinCode, setJoinCode] = useState('')
	const { enqueueSnackbar } = useSnackbar()

	const { fetchApiState, apiState } = useApiState<JoinTeamOutDto>()

	const buttonClick = () => {
		setOpen(true)
	}

	const navigate = useSmartNavigate()

	const onJoinClick = () => {
		fetchApiState(
			async () => {
				return handleApiCall(
					teamJoiningApi.teamJoiningControllerJoinTeam({
						joinCode,
					})
				)
			},
			(data) => {
				navigate('team', {
					alias: data.teamAlias,
				})

				if (data.newMember) {
					enqueueSnackbar('Vítej v týmu!')
				}
			}
		)
	}

	return (
		<>
			<Box
				sx={{
					bgcolor: 'grey.300',
					padding: 2,
					borderRadius: 2,
					boxShadow: '0px 1px 4px rgba(0,0,0,0.3)',
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'center'}
					alignItems={'center'}
					gap={2}
				>
					<Typography size={'1.2rem'}>
						Připoj se k existujímu týmu pomocí kódu
					</Typography>
					<Button color="primarygradient" onClick={buttonClick}>
						Připojit se
					</Button>
				</Box>
			</Box>
			<Popup
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={onJoinClick}
				title="Připojit se k týmu"
				subtitle="Připoj se k existujícímu týmu pomocí kódu"
				actions={
					<>
						<Button sx={{}} type="submit" loading={apiState.loading}>
							Připojit se
						</Button>
					</>
				}
			>
				{apiState.error && (
					<Typography color="red">
						{apiState.error.status === 404
							? 'Skupina s tímto kódem neexistuje'
							: 'Neznámá chyba'}
					</Typography>
				)}
				<TextInput
					placeholder="Zadejte kód"
					value={joinCode}
					onChange={setJoinCode}
					autoFocus
				/>
			</Popup>
		</>
	)
}
