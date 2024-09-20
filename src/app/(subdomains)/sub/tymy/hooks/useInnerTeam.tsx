'use client'
import { useTeamSelection } from '@/app/(subdomains)/sub/tymy/hooks/useTeamSelection'
import { TeamGuid } from '@/app/(subdomains)/sub/tymy/tech'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { UserGuid } from '@/interfaces/user'
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
	const [apiState, reload] = useApiStateEffect(() => {
		return handleApiCall(
			teamGettingApi.teamGettingControllerGetTeamBasicInfo(teamAlias)
		)
	})
	const guid = useMemo(
		() => (apiState.data?.guid || '') as TeamGuid,
		[apiState]
	)
	const selection = useTeamSelection(
		(apiState.data?.selectionGuid || '') as PlaylistGuid,
		guid
	)

	const { user } = useAuth()
	const isCreator = useMemo(() => {
		if (!apiState.data?.createdByGuid) return false
		if (!user) return false
		return apiState.data?.createdByGuid === user?.guid
	}, [apiState, user])

	return {
		guid,
		alias: teamAlias,
		name: apiState.data?.name || '',
		joinCode: apiState.data?.joinCode || '',
		selection,
		isCreator,
		createdByGuid: (apiState.data?.createdByGuid || '') as UserGuid,
		reload,
	}
}
