import { useApi } from '@/api/tech-and-hooks/useApi'
import {
	TeamPayload,
	teamPayloadDefaults,
} from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/payload/tech'
import { TeamGuid } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { usePayload } from '@/hooks/payloads/usePayload'
import { useCallback } from 'react'

export const useTeamPayload = (teamGuid: TeamGuid) => {
	const { teamGettingApi, teamEditingApi } = useApi()

	const getFunc = useCallback(async () => {
		if (!teamGuid) return ''

		return teamGettingApi.teamGettingControllerGetTeamPayload(teamGuid)
	}, [teamGuid])

	const setFunc = useCallback(
		(payload: string) =>
			teamEditingApi.teamEditingControllerEditPayload({
				teamGuid,
				payload,
			}),
		[teamGuid]
	)

	return usePayload<TeamPayload>(getFunc, setFunc, teamPayloadDefaults)
}
