import TeamPlaylistClientProviders from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlist/[guid]/PlaylistClientProviders'
import { LayoutProps } from '@/common/types'
import { useServerApi } from '@/hooks/api/useServerApi'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamPlaylist',
	async ({ params }) => {
		try {
			const api = await useServerApi()
			const playlist =
				await api.playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
					params.guid
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
	await playlistGettingApi.playlistGettingControllerUpdatePlaylistOpenDate(
		props.params.guid
	)

	return (
		<TeamPlaylistClientProviders>{props.children}</TeamPlaylistClientProviders>
	)
}
