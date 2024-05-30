import { PlaylistGettingApi } from '@/api/generated'
import { handleApiCall } from '../../../../tech/handleApiCall'

export const getPlaylistDataByGuid = async (guid: string) => {
	const playlistApi = new PlaylistGettingApi()
	const result = await handleApiCall(
		playlistApi.playlistGettingControllerGetPlaylistDataByGuid(guid)
	)
	return result
}
