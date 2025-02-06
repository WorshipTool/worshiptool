'use client'
import { mapSongVariantDataOutDtoToSongVariantDto } from '@/api/dtos'
import { TeamOfUserDto } from '@/api/generated'
import { useCurrentTeam } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import useUserTeams from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useUserTeams'
import { SongSelectSpecifierProvider } from '@/common/components/SongSelectPopup/hooks/useSongSelectSpecifier'
import { Box, Button } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import usePlaylistsGeneral from '@/hooks/playlist/usePlaylistsGeneral'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import React, { useEffect, useMemo, useState } from 'react'

type AppSongSelectSpecifierProviderProps = {
	children: React.ReactNode
	teamsOptionLabel?: string
}
/**
 * This provider is used in App Providers and also in TeamClientProviders.
 * It provides the song selection from global, user and team songs (except the current team).
 * useCurrentTeam returns null if its used apart from TeamClientProviders.
 */
export default function AppSongSelectSpecifierProvider(
	props: AppSongSelectSpecifierProviderProps
) {
	const [searchString, setSearchString] = React.useState('')
	const { songGettingApi, teamGettingApi } = useApi()
	const { user } = useAuth()

	const [globalApiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchGlobalSongsInPopup(searchString)
		)

		return result.variants.map((v) => {
			return mapSongVariantDataOutDtoToSongVariantDto(v)
		})
	}, [searchString])

	const [usersApiState] = useApiStateEffect(async () => {
		if (!user) {
			return []
		}

		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchMySongsInPopup(searchString)
		)

		return result.variants.map((v) => {
			return mapSongVariantDataOutDtoToSongVariantDto(v)
		})
	}, [searchString, user])

	const team = useCurrentTeam()
	const { teams: t } = useUserTeams()

	const teams = useMemo(() => {
		if (!team) return t
		return t?.filter((t) => t.alias !== team.alias)
	}, [t, team])

	const [selectedTeamAlias, setSelectedTeamAlias] = useState<string | null>(
		null
	)

	const playlist = usePlaylistsGeneral()

	const [teamApiState] = useApiStateEffect(async () => {
		if (!selectedTeamAlias) {
			return []
		}

		if (!teams) {
			return []
		}

		const selectionGuid = teams?.find(
			(t) => t.alias === selectedTeamAlias
		)?.selectionGuid
		if (!selectionGuid) {
			console.error('Selection guid not found - fix this, not necessary')
			return []
		}

		const result = await playlist.searchInPlaylistByGuid(
			selectionGuid as PlaylistGuid,
			searchString
		)

		return result.items.map((v) => {
			return mapSongVariantDataOutDtoToSongVariantDto(v.variant)
		})
	}, [selectedTeamAlias, searchString])

	useEffect(() => {
		if (teams) {
			setSelectedTeamAlias(teams[0]?.alias)
		}
	}, [teams])

	const onTeamClick = (team: TeamOfUserDto) => {
		setSelectedTeamAlias(team.alias)
	}

	return (
		<SongSelectSpecifierProvider
			customSourceList={[
				{
					label: 'Z globálního zpěvníku',
					apiState: globalApiState,
					onSearch: setSearchString,
				},
				{
					label: 'Z mých písní',
					apiState: usersApiState,
					showCount: true,
					onSearch: setSearchString,
				},
				...(teams && teams?.length > 0
					? [
							{
								label: props.teamsOptionLabel || 'Z týmového zpěvníku',
								onSearch: setSearchString,
								apiState: teamApiState,
								optionsComponent: (
									<Box
										display={'flex'}
										flexDirection={'row'}
										gap={1}
										sx={{
											overflowX: 'auto',
										}}
									>
										{teams?.map((team) => {
											return (
												<Button
													key={team.alias}
													size="small"
													variant={
														selectedTeamAlias === team.alias
															? 'contained'
															: 'outlined'
													}
													color={
														selectedTeamAlias === team.alias
															? 'primarygradient'
															: 'primary'
													}
													onClick={() => onTeamClick(team)}
													sx={{
														height: '24px',
													}}
												>
													{team.name}
												</Button>
											)
										})}
									</Box>
								),
							},
					  ]
					: []),
			]}
		>
			{props.children}
		</SongSelectSpecifierProvider>
	)
}
