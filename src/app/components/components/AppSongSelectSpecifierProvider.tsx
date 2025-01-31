'use client'
import { mapSongVariantDataOutDtoToSongVariantDto } from '@/api/dtos'
import { TeamOfUserDto } from '@/api/generated'
import useUserTeams from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useUserTeams'
import { SongSelectSpecifierProvider } from '@/common/components/SongSelectPopup/hooks/useSongSelectSpecifier'
import { Box, Button } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import usePlaylist from '@/hooks/playlist/usePlaylist'
import usePlaylistsGeneral from '@/hooks/playlist/usePlaylistsGeneral'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import React, { useCallback, useEffect, useState } from 'react'

type AppSongSelectSpecifierProviderProps = {
	children: React.ReactNode
}
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

	const { teams } = useUserTeams()
	const [selectedTeamAlias, setSelectedTeamAlias] = useState<string | null>(
		null
	)

	const [teamInfoApiState, reload] = useApiStateEffect(async () => {
		if (!selectedTeamAlias) {
			return null
		}
		return handleApiCall(
			teamGettingApi.teamGettingControllerGetTeamBasicInfo(selectedTeamAlias)
		)
	}, [selectedTeamAlias])

	const playlist = usePlaylistsGeneral()

	const selectionGuid = (teamInfoApiState.data?.selectionGuid ||
		'') as PlaylistGuid

	const selection = usePlaylist(selectionGuid)
	const getData = useCallback(
		async (searchString: string) => {
			if (searchString.length > 0)
				return selection.searchedItems.map((i) => i.variant)
			return selection.items.map((i) => i.variant)
		},
		[selection.items, selection.searchedItems, selection]
	)

	const onTeamSearch = useCallback(
		async (searchString: string) => {
			if (searchString.length > 0) selection.search(searchString)
		},
		[selection]
	)

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
								label: 'Z týmového zpěvníku',
								onSearch: onTeamSearch,
								getData,
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
