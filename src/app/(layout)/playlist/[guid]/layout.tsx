'use server'
import { InnerPlaylistProvider } from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { useServerApi } from '@/hooks/api/useServerApi'
import { useServerPathname } from '@/hooks/pathname/useServerPathname'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
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

	try {
		// Send tick to backend
		await handleApiCall(
			playlistGettingApi.playlistGettingControllerUpdatePlaylistOpenDate(
				props.params.guid
			)
		)
	} catch (e) {
		console.log('Please log-in')
		// console.error(e)
	}

	const pathname = await useServerPathname()
	const afterPlaylist = pathname.split('playlist')[1]
	const isSomethingAfter = afterPlaylist.split('/').length > 2

	if (playlist.teamAlias && !isSomethingAfter) {
		smartRedirect('teamPlaylist', {
			alias: playlist.teamAlias,
			guid: props.params.guid,
		})
	}
	return (
		<InnerPlaylistProvider guid={props.params.guid as PlaylistGuid}>
			{props.children}
		</InnerPlaylistProvider>
	)
}
