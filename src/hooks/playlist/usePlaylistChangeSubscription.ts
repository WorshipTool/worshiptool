import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useEffect } from 'react'

export const PLAYLIST_CHANGE_EVENT_NAME = 'playlist-change'

export type PlaylistChangeEventData = {
	hookId: string
	playlistGuid: PlaylistGuid
}

export const dispatchPlaylistChange = (
	hookId: string,
	playlistGuid: PlaylistGuid
) => {
	window.dispatchEvent(
		new CustomEvent(PLAYLIST_CHANGE_EVENT_NAME, {
			detail: { hookId, playlistGuid } as PlaylistChangeEventData,
		})
	)
}

/**
 * Subscribes to playlist-change events with a STABLE listener reference so the
 * cleanup actually removes it (the previous inline implementation leaked).
 * Skips subscribing entirely when `notFetch` is set.
 */
export const usePlaylistChangeSubscription = ({
	guid,
	uniqueHookId,
	notFetch,
	onChange,
}: {
	guid: PlaylistGuid
	uniqueHookId: string
	notFetch?: boolean
	onChange: () => void
}) => {
	useEffect(() => {
		if (notFetch) return

		const handler = (e: Event) => {
			const data = (e as CustomEvent).detail as PlaylistChangeEventData
			if (data.hookId !== uniqueHookId && data.playlistGuid === guid) {
				onChange()
			}
		}

		window.addEventListener(PLAYLIST_CHANGE_EVENT_NAME, handler)
		return () =>
			window.removeEventListener(PLAYLIST_CHANGE_EVENT_NAME, handler)
	}, [guid, uniqueHookId, notFetch, onChange])
}
