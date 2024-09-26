import { VariantPackGuid } from '@/api/dtos'
import { EditPlaylistItemData } from '@/hooks/playlist/usePlaylistsGeneral.types'
import { useStateWithHistory } from '@/hooks/statewithhistory/useStateWithHistory'
import {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '@/interfaces/playlist/playlist.types'
import { Chord, Sheet } from '@pepavlin/sheet-api'
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

	const {
		state,
		setState,
		reset,
		undo: _undo,
		redo: _redo,
		hasRedo,
		hasUndo,
	} = useStateWithHistory<PlaylistHistoryStateType>(
		{} as PlaylistHistoryStateType
	)

	const playlist = usePlaylist(guid, (data) => {
		setState({
			title: data.title,
			items: data.items.sort((a, b) => {
				return a.order - b.order
			}),
		})
		reset()
	})
	const canUserEdit = useMemo(() => playlist.isOwner, [playlist.isOwner])

	const title = useMemo(() => state.title, [state.title])
	const items = useMemo(() => state.items || [], [state.items])
	const loading = useMemo(() => playlist.loading, [playlist.loading])

	const _change = useCallback(
		(data: Partial<PlaylistHistoryStateType>) => {
			if (!canUserEdit) return
			setState(
				(prev) =>
					({
						...prev,
						...data,
					} as PlaylistHistoryStateType)
			)

			setIsSaved(false)
		},
		[setState, canUserEdit]
	)

	const redo = useCallback(() => {
		_redo()
		setIsSaved(false)
	}, [_redo])

	const undo = useCallback(() => {
		_undo()
		setIsSaved(false)
	}, [_undo])

	const save = async () => {
		if (!canUserEdit) return

		// Save name
		if (playlist.title !== state.title) {
			await playlist.rename(state.title)
		}

		// Remove items
		const removedItems = playlist.items.filter(
			(i) => !state.items.some((j) => j.guid === i.guid)
		)
		for (const item of removedItems) {
			await playlist.removeVariant(item.variant.packGuid)
		}

		// Add new items
		const newItems = state.items.filter(
			(i) => !playlist.items.some((j) => j.guid === i.guid)
		)
		for (const item of newItems) {
			await playlist.addVariant(item.variant.packGuid)
		}

		// Save items order
		if (state.items.length > 0) {
			await playlist.reorder(
				state.items.map((item, index) => ({ guid: item.guid, order: index }))
			)
		}

		// Transpose items
		const transposedItems = state.items.filter(
			(i) =>
				i.toneKey !== playlist.items.find((j) => j.guid === i.guid)?.toneKey
		)

		for (const item of transposedItems) {
			await playlist.setItemsKeyChord(item, new Chord(item.toneKey))
		}

		// Check if title or sheetData has been changed
		const changedItems = state.items.filter((i) => {
			const oldItem = playlist.items.find((j) => j.guid === i.guid)
			return (
				oldItem?.variant.preferredTitle !== i.variant.preferredTitle ||
				oldItem?.variant.sheetData !== i.variant.sheetData
			)
		})
		for (const item of changedItems) {
			// 1. Require item edit
			await playlist.requireItemEdit(item.guid)

			// 2. Then edit the item
			await playlist.editItem(item.guid, {
				title: item.variant.preferredTitle,
				sheetData: item.variant.sheetData,
			})
		}

		// reset()
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
			_change({ items: [...items] })
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

	const addItem = async (packGuid: VariantPackGuid) => {
		const item = await playlist.addVariant(packGuid)
		if (!item) return

		const newItems = [...state.items, item].sort((a, b) => a.order - b.order)
		setItems(newItems)
	}

	const editItem = async (
		itemGuid: PlaylistItemGuid,
		data: EditPlaylistItemData
	) => {
		const item = state.items.find((i) => i.guid === itemGuid)
		if (!item) return

		const newItems = state.items.map((i) => {
			if (i.guid !== itemGuid) return i

			const newItem = { ...i }
			newItem.variant = { ...i.variant }
			if (data.title) newItem.variant.preferredTitle = data.title
			if (data.sheetData) {
				newItem.variant.sheetData = data.sheetData
				newItem.variant.sheet = new Sheet(data.sheetData)
			}

			return newItem
		})
		setItems(newItems)
	}

	return {
		items,
		title,
		loading,
		canUserEdit,
		guid,

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
		addItem,
		editItem,
	}
}
