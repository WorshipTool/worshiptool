import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { createContext, useContext, useEffect, useState } from 'react'
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
	const [guid, setGuid] = useState<PlaylistGuid>()
	const playlist = usePlaylist(guid || ('' as PlaylistGuid))

	const { isLoggedIn } = useAuth()

	useEffect(() => {
		if (!isLoggedIn()) turnOff()
	}, [isLoggedIn])

	const key = 'currentPlaylist'
	const turnOn = (guid: PlaylistGuid) => {
		setGuid(guid)

		localStorage.setItem(key, guid)
	}

	const turnOff = () => {
		setGuid(undefined)
		localStorage.removeItem(key)
	}
	useEffect(() => {
		const loadedGuid = localStorage.getItem(key) as PlaylistGuid
		if (loadedGuid == null) return
		setGuid(loadedGuid)
	}, [])
	return {
		isOn: guid !== undefined,
		turnOn,
		turnOff,
		...playlist,
	}
}
