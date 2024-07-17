import { useStateWithHistory } from '@/hooks/statewithhistory/useStateWithHistory'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { createContext, useContext, useState } from 'react'
import usePlaylist from '../../../../../hooks/playlist/usePlaylist'

type Rt = ReturnType<typeof useProvideInnerPlaylist>
export const innerPlaylistContext = createContext<Rt>({} as Rt)

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

type PlaylistHistoryStateType = {
	title: string
}

const useProvideInnerPlaylist = (guid: PlaylistGuid) => {
	const [isSaved, setIsSaved] = useState<boolean>(true)

	const { state, setState, reset, undo, redo, hasRedo, hasUndo } =
		useStateWithHistory<PlaylistHistoryStateType>(
			{} as PlaylistHistoryStateType
		)

	const playlist = usePlaylist(guid, (data) => {
		setState({ title: data.title })
		reset()
	})

	// const currentPlaylist = useCurrentPlaylist()

	// const same = useMemo(() => {
	// 	return guid !== undefined && currentPlaylist?.guid === guid
	// }, [playlist, currentPlaylist])

	const _change = (data: Partial<PlaylistHistoryStateType>) => {
		setState((prev) => ({ ...prev, ...data } as PlaylistHistoryStateType))
		setIsSaved(false)
	}

	const rename = (title: string) => {
		_change({ title })
	}

	const save = async () => {
		playlist.rename(state.title)
		reset()
		setIsSaved(true)
	}

	return {
		items: playlist.items,
		playlist: playlist.playlist,
		title: state.title,
		loading: playlist.loading,
		isOwner: playlist.isOwner,
		guid: playlist.guid,

		save,
		isSaved,

		rename,
		undo,
		hasUndo,
		redo,
		hasRedo,
		// // ...playlist,
		// isOn: guid !== undefined,
		// ...(same ? currentPlaylist : playlist),
	}
}
