import { useStateWithHistory } from '@/hooks/statewithhistory/useStateWithHistory'
import {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '@/interfaces/playlist/playlist.types'
import { Chord } from '@pepavlin/sheet-api'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
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
	items: PlaylistItemDto[]
}

const useProvideInnerPlaylist = (guid: PlaylistGuid) => {
	const [isSaved, setIsSaved] = useState<boolean>(true)

	const { state, setState, reset, undo, redo, hasRedo, hasUndo } =
		useStateWithHistory<PlaylistHistoryStateType>(
			{} as PlaylistHistoryStateType
		)

	const playlist = usePlaylist(guid, (data) => {
		setState({ title: data.title, items: data.items })
		reset()
	})

	const title = useMemo(() => state.title, [state.title])
	const items = useMemo(() => state.items, [state.items])
	const loading = useMemo(() => playlist.loading, [playlist.loading])

	const _change = useCallback(
		(data: Partial<PlaylistHistoryStateType>) => {
			setState((prev) => ({ ...prev, ...data } as PlaylistHistoryStateType))
			setIsSaved(false)
		},
		[setState]
	)

	const save = async () => {
		playlist.rename(state.title)

		playlist.reorder(
			state.items.map((item, index) => ({ guid: item.guid, order: index }))
		)

		reset()
		setIsSaved(true)
	}

	// Handle unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!isSaved) {
				e.preventDefault()
				e.returnValue = ''
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [isSaved])

	// Handle ctrl-s
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				save()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const rename = useCallback(
		(title: string) => {
			_change({ title })
		},
		[_change]
	)

	const setItems = useCallback(
		(items: PlaylistItemDto[]) => {
			_change({ items })
		},
		[_change]
	)

	const setItemKeyChord = (itemGuid: PlaylistItemGuid, keyChord: Chord) => {
		const toneKey = keyChord.data.rootNote.toString()
		const newItems: PlaylistItemDto[] = state.items.map((i) =>
			i.guid === itemGuid ? { ...i, toneKey } : i
		)

		setItems(newItems)
	}

	const removeItem = (itemGuid: PlaylistItemGuid) => {
		const newItems = state.items
			.filter((i) => i.guid !== itemGuid)
			.sort((a, b) => a.order - b.order)
			.map((i, index) => ({ ...i, order: index }))

		setItems(newItems)
	}

	return {
		items,
		// playlist: playlist.playlist,
		title,
		loading,
		isOwner: playlist.isOwner,
		guid: playlist.guid,

		undo,
		hasUndo,
		redo,
		hasRedo,

		save,
		isSaved,

		rename,
		setItems,
		setItemKeyChord,
		removeItem,

		// // ...playlist,
		// isOn: guid !== undefined,
		// ...(same ? currentPlaylist : playlist),
	}
}
