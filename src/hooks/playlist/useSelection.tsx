import usePlaylist from '@/hooks/playlist/usePlaylist'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'

export const useSelection = (guid: PlaylistGuid) => {
	const selection = usePlaylist(guid)
	return selection
}
