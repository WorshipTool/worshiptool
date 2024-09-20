import { VariantPackGuid } from '@/api/dtos'
import { ReorderPlaylistItem } from '@/api/generated'
import { useApiState } from '@/tech/ApiState'
import { Chord } from '@pepavlin/sheet-api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { mapPlaylistItemOutDtoApiToPlaylistItemDto } from '../../api/dtos/playlist/playlist.map'
import PlaylistDto, {
	PlaylistGuid,
	PlaylistItemDto,
} from '../../interfaces/playlist/playlist.types'
import useAuth from '../auth/useAuth'
import usePlaylistsGeneral from './usePlaylistsGeneral'

export default function usePlaylist(
	guid: PlaylistGuid,
	after?: (data: PlaylistDto) => void
) {
	const {
		addVariantToPlaylist,
		addPacksToPlaylist,
		removeVariantFromPlaylist,
		getPlaylistByGuid,
		searchInPlaylistByGuid,
		renamePlaylist,
		reorderPlaylist,
		setKeyChordOfItem,
	} = usePlaylistsGeneral()

	const [playlist, setPlaylist] = useState<PlaylistDto>()
	const [items, setItems] = useState<PlaylistItemDto[]>([])
	const [searchedItems, setSearchedItems] = useState<PlaylistItemDto[]>([])

	// const [state] = useApiStateEffect(async () => getPlaylistByGuid(guid), [guid])
	const { fetchApiState, apiState: state } = useApiState<PlaylistDto>()

	useEffect(() => {
		if (guid && guid.length > 0) {
			fetchApiState(() => getPlaylistByGuid(guid), after)
		}
	}, [guid])

	const { isLoggedIn, user } = useAuth()

	useEffect(() => {
		if (state.data) {
			setPlaylist(state.data)
			setItems(state.data.items.sort((a, b) => a.order - b.order))
		}
	}, [state])

	const search = useCallback(
		async (searchString: string) => {
			await searchInPlaylistByGuid(guid, searchString)
				.then((r) => {
					const items = r.items.map(mapPlaylistItemOutDtoApiToPlaylistItemDto)
					setSearchedItems(items)
					return items
				})
				.catch((e) => {
					console.error(e)
				})
		},
		[searchInPlaylistByGuid, guid]
	)

	const addVariant = async (
		packGuid: VariantPackGuid
	): Promise<PlaylistItemDto | false> => {
		try {
			const data = await addVariantToPlaylist(packGuid, guid).then(
				async (r) => {
					if (!r) return false
					const item = mapPlaylistItemOutDtoApiToPlaylistItemDto(r)
					setItems((items) => [...items, item])
					return item
				}
			)
			return data
		} catch (e) {
			console.log(e)
			return false
		}
	}

	const addPacks = async (packGuids: VariantPackGuid[]) => {
		const newItems: PlaylistItemDto[] = await addPacksToPlaylist(
			packGuids,
			guid
		)

		// Add new items to the list

		setItems((items) => [...items, ...newItems])
	}

	const removeVariant = async (packGuid: VariantPackGuid): Promise<boolean> => {
		const r = await removeVariantFromPlaylist(packGuid, guid)

		setItems((items) => items.filter((i) => i.variant.packGuid !== packGuid))

		return r
	}

	const removePacks = async (packGuids: VariantPackGuid[]) => {
		const newItems: VariantPackGuid[] = []
		for (const packGuid of packGuids) {
			try {
				const data = await removeVariantFromPlaylist(packGuid, guid)
				if (data) newItems.push(packGuid)
			} catch (e) {
				return false
			}
		}

		// Remove items from the list
		setItems((items) =>
			items.filter((i) => !newItems.includes(i.variant.packGuid))
		)
	}

	const rename = (title: string) => {
		return renamePlaylist(guid, title).then((r) => {
			if (r) {
				setPlaylist({
					...playlist!,
					title: title,
				})
			}
		})
	}

	const reorder = async (reorderItems: ReorderPlaylistItem[]) => {
		const r = await reorderPlaylist(guid, reorderItems)

		setItems(
			items.map((item) => {
				const newItem = reorderItems.find((i) => i.guid === item.guid)
				if (newItem) {
					return {
						...item,
						order: newItem.order,
					}
				}
				return item
			})
		)

		return r
	}

	const setItemsKeyChord = (item: PlaylistItemDto, keyChord: Chord) => {
		return setKeyChordOfItem(item.guid, keyChord)
	}

	const isOwner = useMemo(() => {
		if (!playlist) return false
		if (!isLoggedIn()) return false
		return playlist.ownerGuid === user?.guid
	}, [user, isLoggedIn, playlist])

	return {
		addVariant,
		addPacks,
		removeVariant,
		removePacks,
		rename,
		playlist,
		items,
		searchedItems,
		search,
		guid,
		title: playlist?.title,
		reorder,
		loading: state.loading,
		setItemsKeyChord,
		isOwner,

		_setItems: setItems,
	}
}
