import { useLocalStorage } from '@/hooks/localstorage/useLocalStorage'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { createContext, useCallback, useContext, useEffect } from 'react'
import useAuth from '../auth/useAuth'
import usePlaylist from './usePlaylist'

export const playlistContext = createContext<useProvidePlaylistI>(
	{} as useProvidePlaylistI
)

export default function useCurrentPlaylist() {
	return useContext(playlistContext)
}

export const PlaylistProvider = ({ children }: { children: any }) => {
	const p = useProvidePlaylist()

	return (
		<playlistContext.Provider value={p}>{children}</playlistContext.Provider>
	)
}

interface useProvidePlaylistI extends ReturnType<typeof usePlaylist> {
	isOn: boolean
	turnOn: (guid: PlaylistGuid) => void
	turnOff: () => void
}

export const useProvidePlaylist = (): useProvidePlaylistI => {
	const { value: guid, set: setGuid } =
		useLocalStorage<PlaylistGuid>('currentPlaylist')
	const playlist = usePlaylist(guid || ('' as PlaylistGuid))

	const { isLoggedIn } = useAuth()

	const turnOff = useCallback(() => {
		setGuid(undefined)
	}, [setGuid])

	useEffect(() => {
		if (!isLoggedIn()) turnOff()
	}, [isLoggedIn, turnOff])

	const turnOn = (guid: PlaylistGuid) => {
		setGuid(guid)
	}

	return {
		isOn: guid !== undefined,
		turnOn,
		turnOff,
		...playlist,
	}
}
