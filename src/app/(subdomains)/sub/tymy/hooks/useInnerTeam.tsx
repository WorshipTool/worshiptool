'use client'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { createContext, useContext } from 'react'
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

	return {
		alias: teamAlias,
		name: apiState.data?.name || '',
	}
}
