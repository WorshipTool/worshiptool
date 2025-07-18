'use client'
import { PostCreatePlaylistResult } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamQuickActionButton'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { Add } from '@mui/icons-material'
import { useCallback } from 'react'

export default function TeamNewPlaylistButton() {
	const { playlistEditingApi, teamEditingApi } = useApi()
	const { alias, guid } = useInnerTeam()

	const { turnOn } = useCurrentPlaylist()

	const navigate = useSmartNavigate()

	const { fetchApiState, apiState } = useApiState<PostCreatePlaylistResult>()

	const onCreateClick = useCallback(() => {
		fetchApiState(
			async () => {
				const p = await playlistEditingApi.createPlaylist()

				await teamEditingApi.attachPlaylistToTeam({
					teamGuid: guid,
					playlistGuid: p,
				})

				return {
					guid: p,
				}
			},
			(d) => {
				// const url = getRouteUrlWithParams('teamPlaylist', {
				// 	guid: d.guid,
				// 	alias,
				// })

				// // open on new tab
				// window.open(url, '_blank')
				turnOn(d.guid as PlaylistGuid)

				navigate('teamPlaylist', {
					guid: d.guid,
					alias,
				})
			}
		)
	}, [guid])

	return (
		<TeamQuickActionButton
			onClick={onCreateClick}
			loading={apiState.loading}
			label={'Vytvořit playlist'}
			tooltip={'Vytvořit nový playlist'}
			icon={
				<Add
					sx={{
						strokeWidth: 2,
					}}
				/>
			}
		/>
	)
}
