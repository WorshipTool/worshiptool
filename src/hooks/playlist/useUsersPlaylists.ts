import usePlaylistsGeneral from '@/hooks/playlist/usePlaylistsGeneral'
import { useApiStateEffect } from '@/tech/ApiState'

export function useUsersPlaylists() {
	const { getPlaylistsOfUser } = usePlaylistsGeneral()
	const [{ data: playlists, loading }] = useApiStateEffect(() => {
		return getPlaylistsOfUser().then((r) => {
			return r.playlists
		})
	}, [])
	return {
		playlists,
		loading,
	}
}
