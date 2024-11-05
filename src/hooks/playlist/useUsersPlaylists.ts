import usePlaylistsGeneral, {
	PLAYLIST_UPDATE_EVENT_NAME,
} from '@/hooks/playlist/usePlaylistsGeneral'
import { useApiStateEffect } from '@/tech/ApiState'
import { useEffect } from 'react'

export function useUsersPlaylists() {
	const { getPlaylistsOfUser } = usePlaylistsGeneral()
	const [{ data: playlists, loading }, reload] = useApiStateEffect(() => {
		return getPlaylistsOfUser().then((r) => {
			return r.playlists
		})
	}, [])

	useEffect(() => {
		const handler = (e: Event) => {
			if (!playlists) return
			const event = e as CustomEvent

			const guid = event.detail as string
			if (!guid) return

			// if guid is in playlists, reload
			if (playlists?.some((p) => p.guid === guid)) {
				reload()
			}
		}

		window.addEventListener(PLAYLIST_UPDATE_EVENT_NAME, handler)

		return () => {
			window.removeEventListener(PLAYLIST_UPDATE_EVENT_NAME, handler)
		}
	}, [playlists, reload, getPlaylistsOfUser])

	return {
		playlists,
		loading,
	}
}
