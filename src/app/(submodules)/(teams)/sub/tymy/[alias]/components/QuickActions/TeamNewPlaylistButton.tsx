'use client'
import { PostCreatePlaylistResult } from '@/api/generated'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamQuickActionButton'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { useApi } from '@/hooks/api/useApi'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { Add } from '@mui/icons-material'
import { useCallback } from 'react'
import { handleApiCall } from '../../../../../../../../tech/handleApiCall'

export default function TeamNewPlaylistButton() {
	const { playlistEditingApi, teamEditingApi } = useApi()
	const { alias, guid } = useInnerTeam()

	const { turnOn } = useCurrentPlaylist()

	const navigate = useSmartNavigate()

	const { fetchApiState, apiState } = useApiState<PostCreatePlaylistResult>()

	const onCreateClick = useCallback(() => {
		fetchApiState(
			async () => {
				const p = await handleApiCall(
					playlistEditingApi.playlistEditingControllerCreatePlaylist()
				)

				await teamEditingApi.teamSelectionControllerAttachPlaylistToTeam({
					teamGuid: guid,
					playlistGuid: p.guid,
				})

				return p
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
