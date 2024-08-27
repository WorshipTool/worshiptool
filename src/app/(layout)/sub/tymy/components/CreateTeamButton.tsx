'use client'
import { CreateTeamOutDto } from '@/api/generated'
import { Button } from '@/common/ui/Button'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'

export default function CreateTeamButton() {
	const { teamAddingApi } = useApi()

	const { apiState, fetchApiState } = useApiState<CreateTeamOutDto>()

	const navigate = useSmartNavigate()

	const onClick = () => {
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
	)
}
