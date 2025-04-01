import { PlaylistData } from '@/api/generated'
import { useCommonData } from '@/hooks/common-data/useCommonData'
import usePlaylistsGeneral, {
	PLAYLIST_UPDATE_EVENT_NAME,
} from '@/hooks/playlist/usePlaylistsGeneral'
import { useApiState } from '@/tech/ApiState'
import { useEffect, useState } from 'react'

export function useUsersPlaylists() {
	const initialValue = useCommonData('playlistsOfUser')
	const [data, setData] = useState<PlaylistData[]>(initialValue)

	const { getPlaylistsOfUser } = usePlaylistsGeneral()
	const { fetchApiState, apiState } = useApiState<PlaylistData[]>()

	const revalidate = async () => {
		fetchApiState(async () => {
			const data = await getPlaylistsOfUser()
			return data.playlists
		})
			.then((r) => {
				if (r) setData(r)
			})
			.catch(() => {})
	}

	useEffect(() => {
		const handler = (e: Event) => {
			if (!data) return
			const event = e as CustomEvent

			const guid = event.detail as string
			if (!guid) return

			// if guid is in playlists, reload
			if (data?.some((p) => p.guid === guid)) {
				revalidate()
			}
		}

		window.addEventListener(PLAYLIST_UPDATE_EVENT_NAME, handler)

		return () => {
			window.removeEventListener(PLAYLIST_UPDATE_EVENT_NAME, handler)
		}
	}, [data, revalidate, getPlaylistsOfUser])

	return {
		playlists: data,
		loading: apiState.loading,
	}
}
