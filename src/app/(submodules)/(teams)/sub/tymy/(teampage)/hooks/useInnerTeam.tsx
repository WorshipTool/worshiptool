'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { useTeamEvents } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamEvents'
import { useTeamMembers } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamMembers'
import { useTeamNotes } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamNotes'
import { useTeamSelection } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamSelection'
import { TeamGuid } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import useAuth from '@/hooks/auth/useAuth'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { UserGuid } from '@/interfaces/user'
import { useApiStateEffect } from '@/tech/ApiState'
import { createContext, useContext, useMemo } from 'react'

type Rt = ReturnType<typeof useProvideInnerTeam>

export const innerTeamContext = createContext<Rt>({
	uninitialized: true,
} as any as Rt)

export default function useInnerTeam() {
	return useContext(innerTeamContext)
}

export function useTeamChecker() {
	const d: any = useContext(innerTeamContext)
	return !Boolean(d.uninitialized)
}

export function useCurrentTeam() {
	const d: any = useContext(innerTeamContext)

	if (Boolean(d.uninitialized)) return null
	return d as Rt
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

// Must work even for non-logged in users

const useProvideInnerTeam = (teamAlias: string) => {
	const { teamGettingApi, teamMembersApi } = useApi()
	const [apiState, reload] = useApiStateEffect(() => {
		return teamGettingApi.getTeamBasicInfo(teamAlias)
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

	const events = useTeamEvents(guid)
	const members = useTeamMembers(teamAlias, guid)
	const notes = useTeamNotes(guid)

	return {
		guid,
		apiState,
		membersApiState: members.apiState,
		members: members,
		alias: teamAlias,
		name: apiState.data?.name || '',
		joinCode: apiState.data?.joinCode || '',
		selection,
		isCreator,
		createdByGuid: (apiState.data?.createdByGuid || '') as UserGuid,
		reload,
		events,
		notes,
	}
}
