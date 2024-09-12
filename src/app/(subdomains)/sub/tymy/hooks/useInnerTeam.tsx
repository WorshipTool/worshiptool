'use client'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useSelection } from '@/hooks/playlist/useSelection'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useApiStateEffect } from '@/tech/ApiState'
import { createContext, useContext, useMemo } from 'react'
import { handleApiCall } from '../../../../../tech/handleApiCall'

type Rt = ReturnType<typeof useProvideInnerTeam>

export const innerTeamContext = createContext<Rt>({} as Rt)

export default function useInnerTeam() {
	return useContext(innerTeamContext)
}

export const InnerTeamProvider = ({
	children,
	teamAlias,
}: {
	children: any
	teamAlias: string
}) => {
	const data = useProvideInnerTeam(teamAlias)
	return (
		<innerTeamContext.Provider value={data}>
			{children}
		</innerTeamContext.Provider>
	)
}

const useProvideInnerTeam = (teamAlias: string) => {
	const { teamGettingApi } = useApi()
	const [apiState] = useApiStateEffect(() => {
		return handleApiCall(
			teamGettingApi.teamGettingControllerGetTeamBasicInfo(teamAlias)
		)
	})
	const selection = useSelection(
		(apiState.data?.selectionGuid || '') as PlaylistGuid
	)

	const { user } = useAuth()
	const isCreator = useMemo(() => {
		if (!apiState.data?.createdByGuid) return false
		if (!user) return false
		return apiState.data?.createdByGuid === user?.guid
	}, [apiState, user])

	return {
		guid: apiState.data?.guid || '',
		alias: teamAlias,
		name: apiState.data?.name || '',
		selection,
		isCreator,
		createdByGuid: apiState.data?.createdByGuid || '',
	}
}
