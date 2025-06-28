import { useApi } from '@/api/tech-and-hooks/useApi'
import { TeamGuid } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'

export const useTeamNotes = (teamGuid: TeamGuid) => {
	const { user } = useAuth()
	const { teamSongNotesApi } = useApi()
	const [apiState, fetchData] = useApiStateEffect(async () => {
		if (!user || !teamGuid) return []

		const data = await teamSongNotesApi.teamSongNoteControllerGetAllNotesOfTeam(
			teamGuid
		)
		return data.notes
	}, [teamGuid, teamSongNotesApi, user])

	return {
		notes: apiState.data || [],
		apiState,
		reload: fetchData,
	}
}
