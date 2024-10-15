'use client'
import { PostCreatePlaylistResult } from '@/api/generated'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamQuickActionButton'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { Add } from '@mui/icons-material'
import { useCallback } from 'react'
import { handleApiCall } from '../../../../../../../../tech/handleApiCall'

export default function TeamNewPlaylistButton() {
	const { playlistEditingApi } = useApi()
	const { alias } = useInnerTeam()

	const navigate = useSmartNavigate()

	const { fetchApiState, apiState } = useApiState<PostCreatePlaylistResult>()

	const onCreateClick = useCallback(() => {
		fetchApiState(
			async () => {
				return await handleApiCall(
					playlistEditingApi.playlistEditingControllerCreatePlaylist()
				)
			},
			(d) => {
				// const url = getRouteUrlWithParams('teamPlaylist', {
				// 	guid: d.guid,
				// 	alias,
				// })

				// // open on new tab
				// window.open(url, '_blank')

				navigate('teamPlaylist', {
					guid: d.guid,
					alias,
				})
			}
		)
	}, [])

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
