import { EVENT_NAME_CHANGE_TEAM_LOGO } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/hooks/useTeamLogo'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { useEffect } from 'react'

export default function useUserTeams() {
	const { user } = useAuth()
	const { teamMembersApi } = useApi()
	const [apiState, reinvalidate] = useApiStateEffect(async () => {
		if (!user) return []
		const result = await handleApiCall(
			teamMembersApi.teamMemberControllerGetTeamsOfUser()
		)
		return result.teams
	}, [teamMembersApi, user])

	// Reload when team logo changes
	useEffect(() => {
		const reload = async () => {
			reinvalidate()
		}

		window.addEventListener(EVENT_NAME_CHANGE_TEAM_LOGO, reload)
		return () => {
			window.removeEventListener(EVENT_NAME_CHANGE_TEAM_LOGO, reload)
		}
	}, [])
	return {
		...apiState,
		teams: apiState.data,
	}
}
