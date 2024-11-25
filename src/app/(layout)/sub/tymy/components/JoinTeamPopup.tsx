import { JoinTeamOutDto } from '@/api/generated'
import {
	NEW_TEAM_MEMBER_MESSAGE_GROUP,
	NEW_TEAM_MEMBER_MESSAGE_NAME,
} from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamMembers'
import Popup from '@/common/components/Popup/Popup'
import { Button, TextInput, Typography } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { useLiveMessage } from '@/hooks/sockets/useLiveMessage'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

type Props = {
	open: boolean
	onClose: () => void
}

export default function JoinTeamPopup(props: Props) {
	const { teamJoiningApi } = useApi()

	const [joinCode, setJoinCode] = useState('')
	const { enqueueSnackbar } = useSnackbar()

	const { fetchApiState, apiState } = useApiState<JoinTeamOutDto>()

	const navigate = useSmartNavigate()
	const { send } = useLiveMessage(NEW_TEAM_MEMBER_MESSAGE_GROUP)

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
					send(NEW_TEAM_MEMBER_MESSAGE_NAME, {})
				}
			}
		)
	}
	return (
		<Popup
			open={props.open}
			onClose={props.onClose}
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
	)
}
