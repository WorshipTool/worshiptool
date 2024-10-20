import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'

export default function useUserTeams() {
	const { user } = useAuth()
	const { teamMembersApi } = useApi()
	const [apiState] = useApiStateEffect(async () => {
		if (!user) return []
		const result = await handleApiCall(
			teamMembersApi.teamMemberControllerGetTeamsOfUser()
		)
		return result.teams
	}, [teamMembersApi, user])
	return {
		...apiState,
		teams: apiState.data,
	}
}
