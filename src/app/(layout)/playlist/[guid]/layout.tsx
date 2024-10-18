'use server'
import { useServerApi } from '@/hooks/api/useServerApi'
import { smartRedirect } from '@/routes/routes.tech.server'
import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { LayoutProps, MetadataProps } from '../../../../common/types'
import { handleApiCall } from '../../../../tech/handleApiCall'

export const generateMetadata = generateSmartMetadata(
	'playlist',
	async ({ params }: MetadataProps<'playlist'>) => {
		const { playlistGettingApi } = await useServerApi()
		try {
			const playlist = await handleApiCall(
				playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
					params.guid
				)
			)

			const title = playlist ? playlist.title + ' (Playlist)' : 'Playlist'
			return {
				title: title,
			}
		} catch (e) {
			return {
				title: 'Playlist',
			}
		}
	}
)

export default async function Layout(props: LayoutProps<'playlist'>) {
	const { playlistGettingApi } = await useServerApi()
	const playlist = await handleApiCall(
		playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
			props.params.guid
		)
	)
	if (playlist.teamAlias)
		smartRedirect('teamPlaylist', {
			guid: playlist.guid,
			alias: playlist.teamAlias,
		})
	return <>{props.children}</>
}
