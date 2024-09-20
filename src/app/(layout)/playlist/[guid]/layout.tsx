import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { PlaylistGettingApi } from '../../../../api/generated'
import { LayoutProps, MetadataProps } from '../../../../common/types'
import { handleApiCall } from '../../../../tech/handleApiCall'

export const generateMetadata = generateSmartMetadata(
	'playlist',
	async ({ params }: MetadataProps<'playlist'>) => {
		const api = new PlaylistGettingApi()
		try {
			const playlist = await handleApiCall(
				api.playlistGettingControllerGetPlaylistDataByGuid(params.guid)
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

export default function layout(props: LayoutProps) {
	return <>{props.children}</>
}
