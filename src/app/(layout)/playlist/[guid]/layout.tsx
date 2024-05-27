import { PlaylistGettingApi } from '../../../../api/generated'
import { LayoutProps, MetadataProps } from '../../../../common/types'
import { generateMetadataTitle } from '../../../../hooks/window-title/tech'
import { handleApiCall } from '../../../../tech/handleApiCall'

export const generateMetadata = async ({
	params,
}: MetadataProps<'playlist'>) => {
	const api = new PlaylistGettingApi()
	try {
		const playlist = await handleApiCall(
			api.playlistGettingControllerGetPlaylistDataByGuid(params.guid)
		)

		const title = playlist ? playlist.title + ' (Playlist)' : 'Playlist'
		return {
			title: await generateMetadataTitle(title, 'playlist', params),
		}
	} catch (e) {
		return {
			title: await generateMetadataTitle('Playlist', 'playlist', params),
		}
	}
}

export default function layout(props: LayoutProps) {
	return <>{props.children}</>
}
