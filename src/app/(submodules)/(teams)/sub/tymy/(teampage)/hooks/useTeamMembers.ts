import { useApi } from '@/api/tech-and-hooks/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useLiveMessage } from '@/hooks/sockets/useLiveMessage'
import { useApiStateEffect } from '@/tech/ApiState'
import { useMemo } from 'react'

export const NEW_TEAM_MEMBER_MESSAGE_NAME = 'newTeamMemberJoined'
export const NEW_TEAM_MEMBER_MESSAGE_GROUP = 'joiningteamgroup'

export function useTeamMembers(teamAlias: string, teamGuid: string) {
	const { teamMembersApi } = useApi()
	const [apiState, fetchData] = useApiStateEffect(async () => {
		const data = await teamMembersApi.teamMemberControllerGetTeamMembers(
			teamAlias
		)
		return data
	}, [teamAlias])

	const { user } = useAuth()
	const me = useMemo(() => {
		return apiState.data?.members.find((m) => m.userGuid === user?.guid)
	}, [apiState, user])

	const members = useMemo(() => {
		const arr =
			apiState.data?.members.filter((m) => m.userGuid !== user?.guid) ?? []
		return arr
	}, [apiState])

	useLiveMessage(NEW_TEAM_MEMBER_MESSAGE_GROUP, {
		[NEW_TEAM_MEMBER_MESSAGE_NAME]: () => {
			fetchData()
		},
	})

	return {
		apiState,
		reload: fetchData,
		me,
		members,
	}
}
