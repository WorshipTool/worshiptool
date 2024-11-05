import { VariantPackGuid } from '@/api/dtos'
import { useApi } from '@/hooks/api/useApi'
import { EditPlaylistItemData } from '@/hooks/playlist/usePlaylistsGeneral.types'
import { Chord } from '@pepavlin/sheet-api'
import { useCallback } from 'react'
import {
	mapPlaylistDataOutDtoToPlaylistDto,
	mapPlaylistItemOutDtoApiToPlaylistItemDto,
} from '../../api/dtos/playlist/playlist.map'
import {
	GetSearchInPlaylistResult,
	ReorderPlaylistInDto,
} from '../../api/generated'
import Playlist, {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '../../interfaces/playlist/playlist.types'
import { hac, handleApiCall } from '../../tech/handleApiCall'

export const PLAYLIST_UPDATE_EVENT_NAME = 'playlist-update'

export const getPlaylistUpdateEventName = (guid: PlaylistGuid) =>
	`${PLAYLIST_UPDATE_EVENT_NAME}-${guid}`

export default function usePlaylistsGeneral() {
	const { playlistEditingApi, playlistGettingApi } = useApi()

	const addVariantToPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerAddVariantToPlaylist({
				playlist,
				packGuid,
			})
		)
	}

	const addPacksToPlaylist = async (
		packGuids: VariantPackGuid[],
		playlist: PlaylistGuid
	) => {
		const newItems: PlaylistItemDto[] = []
		for (const packGuid of packGuids) {
			try {
				const data = await addVariantToPlaylist(packGuid, playlist).then(
					async (r) => {
						if (!r) return false
						const item = mapPlaylistItemOutDtoApiToPlaylistItemDto(r)
						return item
					}
				)
				if (data) newItems.push(data)
			} catch (e) {}
		}

		return newItems
	}

	const removeVariantFromPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerRemoveVariantFromPlaylistDelete(
				packGuid,
				playlist
			)
		)
	}

	const isVariantInPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	): Promise<boolean> => {
		const result = await handleApiCall(
			playlistGettingApi.playlistGettingControllerIsVariantInPlaylist(
				packGuid,
				playlist
			)
		)

		return result
	}

	const getPlaylistsOfUser = async () => {
		return await handleApiCall(
			playlistGettingApi.playlistGettingControllerGetPlaylistsOfUser()
		)
	}

	const createPlaylist = async (): Promise<PlaylistGuid> => {
		const createdApi = await handleApiCall(
			playlistEditingApi.playlistEditingControllerCreatePlaylist()
		)
		return createdApi.guid as PlaylistGuid
	}

	const deletePlaylist = async (guid: PlaylistGuid) => {
		const r = await handleApiCall(
			playlistEditingApi.playlistEditingControllerDeletePlaylist(guid)
		)
		updatePlaylistTick(guid)
		return r
	}

	const getPlaylistByGuid = async (guid: PlaylistGuid): Promise<Playlist> => {
		const result = await handleApiCall(
			playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(guid)
		)
		return mapPlaylistDataOutDtoToPlaylistDto(result)
	}

	const searchInPlaylistByGuid = useCallback(
		async (
			playlistGuid: PlaylistGuid,
			searchString: string
		): Promise<GetSearchInPlaylistResult> => {
			return await handleApiCall(
				playlistGettingApi.playlistGettingControllerSearchInPlaylist(
					searchString,
					playlistGuid
				)
			)
		},
		[playlistGettingApi]
	)

	const renamePlaylist = async (guid: PlaylistGuid, title: string) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerRenamePlaylist({
				guid,
				title,
			})
		)
	}

	const reorderPlaylist = async (
		playlistGuid: PlaylistGuid,
		items: ReorderPlaylistInDto['items']
	) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerReorderPlaylist({
				guid: playlistGuid,
				items,
			})
		)
	}

	const setKeyChordOfItem = async (guid: PlaylistItemGuid, keyChord: Chord) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerTransposePlaylistItem({
				guid,
				key: keyChord.data.rootNote.toString(),
			})
		)
	}

	const editPlaylistItem = async (
		guid: PlaylistItemGuid,
		data: EditPlaylistItemData
	) => {
		return await hac(
			playlistEditingApi.playlistEditingControllerEditItem({
				itemGuid: guid,
				title: data.title,
				sheetData: data.sheetData,
			})
		)
	}

	const requireItemEdit = useCallback(
		async (guid: PlaylistItemGuid) => {
			return await handleApiCall(
				playlistEditingApi.playlistEditingControllerRequireItemEdit({
					itemGuid: guid,
				})
			)
		},
		[playlistEditingApi]
	)

	const updatePlaylistTick = async (guid: PlaylistGuid) => {
		window.dispatchEvent(
			new CustomEvent(PLAYLIST_UPDATE_EVENT_NAME, { detail: guid })
		)

		window.dispatchEvent(new Event(getPlaylistUpdateEventName(guid)))
	}

	return {
		addVariantToPlaylist,
		addPacksToPlaylist,
		removeVariantFromPlaylist,
		isVariantInPlaylist,
		getPlaylistsOfUser,
		createPlaylist,
		deletePlaylist,
		getPlaylistByGuid,
		searchInPlaylistByGuid,
		renamePlaylist,
		reorderPlaylist,
		setKeyChordOfItem,

		// Item editing
		editPlaylistItem,
		requireItemEdit,

		// loading
	}
}
