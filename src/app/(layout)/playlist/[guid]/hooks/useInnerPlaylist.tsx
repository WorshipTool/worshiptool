'use client'
import { VariantPackGuid } from '@/api/dtos'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import usePlaylist from '@/hooks/playlist/usePlaylist'
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
	} = useStateWithHistory<PlaylistHistoryStateType>({
		title: '',
		items: [],
	})

	const current = useCurrentPlaylist()
	const isCurrent = useMemo(
		() => current.guid === guid && Boolean(guid),
		[current.guid, guid]
	)
	const _playlist = usePlaylist(guid, undefined, isCurrent)
	const playlist = isCurrent ? current : _playlist

	const [hasInitialized, setHasInitialized] = useState(false)

	useEffect(() => {
		if (playlist.playlist && !playlist.loading && !hasInitialized) {
			setState({
				title: playlist.title || '',
				items: playlist.items.sort((a, b) => a.order - b.order),
			})
			reset()
			setHasInitialized(true)
		}
	}, [playlist, hasInitialized])

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
		if (playlist.title !== state.title && state.title) {
			await playlist.rename(state.title)
		}

		// Remove items
		const removedItems = playlist.items.filter(
			(i) => !state.items.some((j) => j.guid === i.guid)
		)
		for (const item of removedItems) {
			await playlist.removeVariant(item.pack.packGuid)
		}

		// Add new items
		const newItems = state.items.filter(
			(i) => !playlist.items.some((j) => j.guid === i.guid)
		)
		for (const item of newItems) {
			await playlist.addVariant(item.pack.packGuid)
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
				oldItem?.pack.title !== i.pack.title ||
				oldItem?.pack.sheetData !== i.pack.sheetData
			)
		})
		for (const item of changedItems) {
			// 1. Require item edit
			await playlist.requireItemEdit(item.guid)

			// 2. Then edit the item
			await playlist.editItem(item.guid, {
				title: item.pack.title,
				sheetData: item.pack.sheetData,
			})
		}

		// reset()
		setIsSaved(true)
	}

	// Shortcuts
	useEffect(() => {
		// Add CTRL+Z and CTRL+Y support for undo and redo
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'z':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault()
						undo()
					}
					break
				case 'y':
					if (event.ctrlKey || event.metaKey) {
						if (event.shiftKey) {
							event.preventDefault()
							undo()
						} else {
							event.preventDefault()
							redo()
						}
					}
					break

				// Save with shortcut
				case 's':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault()
						save()
					}
					break
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [redo, undo])

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
			newItem.pack = { ...i.pack }
			if (data.title) newItem.pack.title = data.title
			if (data.sheetData) {
				newItem.pack.sheetData = data.sheetData
				newItem.pack.sheet = new Sheet(data.sheetData)
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
		data: playlist.playlist,
	}
}
