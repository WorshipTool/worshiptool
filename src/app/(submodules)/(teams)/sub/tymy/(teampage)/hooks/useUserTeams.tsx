import { TeamOfUserDto } from '@/api/generated'
import { EVENT_NAME_CHANGE_TEAM_LOGO } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/hooks/useTeamLogo'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useCommonData } from '@/hooks/common-data/useCommonData'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { useEffect, useRef, useState } from 'react'

export default function useUserTeams() {
	const initialValue = useCommonData('teamsOfUser')

	const [data, setData] = useState<TeamOfUserDto[]>(initialValue)

	const { user } = useAuth()
	const { teamMembersApi } = useApi()
	const { fetchApiState, apiState } = useApiState<TeamOfUserDto[]>()

	const revalidate = async () => {
		fetchApiState(async () => {
			if (!user) return []
			const result = await handleApiCall(
				teamMembersApi.teamMemberControllerGetTeamsOfUser()
			)
			return result.teams
		})
			.then((r) => {
				if (r) {
					setData(r)
				}
			})
			.catch(() => {})
	}

	const first = useRef(true)
	useEffect(() => {
		// if (first.current) {
		// 	first.current = false
		// 	return
		// }
		revalidate()
	}, [user])

	// Reload when team logo changes
	useEffect(() => {
		const reload = async () => {
			revalidate()
		}

		window.addEventListener(EVENT_NAME_CHANGE_TEAM_LOGO, reload)
		return () => {
			window.removeEventListener(EVENT_NAME_CHANGE_TEAM_LOGO, reload)
		}
	}, [])

	return {
		loading: apiState.loading,
		teams: data,
	}
}
