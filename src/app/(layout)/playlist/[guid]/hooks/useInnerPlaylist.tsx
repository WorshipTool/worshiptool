import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { createContext, useContext, useMemo } from 'react'
import useCurrentPlaylist from '../../../../../hooks/playlist/useCurrentPlaylist'
import usePlaylist from '../../../../../hooks/playlist/usePlaylist'

export const innerPlaylistContext = createContext<useProvidePlaylistI>(
	{} as useProvidePlaylistI
)

export default function useInnerPlaylist() {
	return useContext(innerPlaylistContext)
}

export const InnerPlaylistProvider = ({
	children,
	guid,
}: {
	children: any
	guid: PlaylistGuid
}) => {
	const p = useProvideInnerPlaylist(guid)

	return (
		<innerPlaylistContext.Provider value={p}>
			{children}
		</innerPlaylistContext.Provider>
	)
}

interface useProvidePlaylistI extends ReturnType<typeof usePlaylist> {
	isOn: boolean
}

export const useProvideInnerPlaylist = (
	guid: PlaylistGuid
): useProvidePlaylistI => {
	const playlist = usePlaylist(guid)

	const currentPlaylist = useCurrentPlaylist()

	const same = useMemo(() => {
		return guid !== undefined && currentPlaylist?.guid === guid
	}, [playlist, currentPlaylist])

	return {
		isOn: guid !== undefined,
		...(same ? currentPlaylist : playlist),
	}
}
