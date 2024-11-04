import { LayoutProps } from '@/common/types'
import { useServerApi } from '@/hooks/api/useServerApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamPlaylist',
	async ({ params }) => {
		try {
			const api = await useServerApi()
			const playlist = await handleApiCall(
				api.playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
					params.guid
				)
			)
			if (playlist) {
				return {
					title: `${playlist.title} (Playlist)`,
				}
			}
		} catch (e) {
			return {
				title: 'Playlist',
			}
		}
		return {
			title: 'Playlist',
		}
	}
)

export default async function Layout(props: LayoutProps<'teamPlaylist'>) {
	const { playlistGettingApi } = await useServerApi()

	// Send tick to backend
	await handleApiCall(
		playlistGettingApi.playlistGettingControllerUpdatePlaylistOpenDate(
			props.params.guid
		)
	)

	return props.children
}
