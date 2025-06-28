import { VariantPackGuid } from '@/api/dtos'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { EditPlaylistItemData } from '@/hooks/playlist/usePlaylistsGeneral.types'
import { Chord } from '@pepavlin/sheet-api'
import { useCallback } from 'react'
import {
	GetSearchInPlaylistResult,
	ReorderPlaylistInDto,
} from '../../api/generated'
import Playlist, {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '../../interfaces/playlist/playlist.types'

export const PLAYLIST_UPDATE_EVENT_NAME = 'playlist-update'

export const getPlaylistUpdateEventName = (guid: PlaylistGuid) =>
	`${PLAYLIST_UPDATE_EVENT_NAME}-${guid}`

export default function usePlaylistsGeneral() {
	const { playlistEditingApi, playlistGettingApi } = useApi()

	const addVariantToPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	) => {
		return await playlistEditingApi.playlistEditingControllerAddVariantToPlaylist(
			{
				playlist,
				packGuid,
			}
		)
	}

	const addPacksToPlaylist = async (
		packGuids: VariantPackGuid[],
		playlist: PlaylistGuid
	) => {
		const newItems: PlaylistItemDto[] = []
		for (const packGuid of packGuids) {
			try {
				const data = await addVariantToPlaylist(packGuid, playlist)
				if (data) newItems.push(data)
			} catch (e) {}
		}

		return newItems
	}

	const removeVariantFromPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	) => {
		return await playlistEditingApi.playlistEditingControllerRemoveVariantFromPlaylistDelete(
			packGuid,
			playlist
		)
	}

	const isVariantInPlaylist = async (
		packGuid: VariantPackGuid,
		playlist: PlaylistGuid
	): Promise<boolean> => {
		return await playlistGettingApi.playlistGettingControllerIsVariantInPlaylist(
			packGuid,
			playlist
		)
	}

	const getPlaylistsOfUser = async () => {
		return await playlistGettingApi.playlistGettingControllerGetPlaylistsOfUser()
	}

	const createPlaylist = async (): Promise<PlaylistGuid> => {
		return await playlistEditingApi.playlistEditingControllerCreatePlaylist()
	}

	const deletePlaylist = async (guid: PlaylistGuid) => {
		const r = await playlistEditingApi.playlistEditingControllerDeletePlaylist(
			guid
		)
		updatePlaylistTick(guid)
		return r
	}

	const getPlaylistByGuid = async (guid: PlaylistGuid): Promise<Playlist> => {
		return await playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
			guid
		)
	}

	const searchInPlaylistByGuid = useCallback(
		async (
			playlistGuid: PlaylistGuid,
			searchString: string
		): Promise<GetSearchInPlaylistResult> => {
			return await playlistGettingApi.playlistGettingControllerSearchInPlaylist(
				searchString,
				playlistGuid
			)
		},
		[playlistGettingApi]
	)

	const renamePlaylist = async (guid: PlaylistGuid, title: string) => {
		return await playlistEditingApi.playlistEditingControllerRenamePlaylist({
			guid,
			title,
		})
	}

	const reorderPlaylist = async (
		playlistGuid: PlaylistGuid,
		items: ReorderPlaylistInDto['items']
	) => {
		return await playlistEditingApi.playlistEditingControllerReorderPlaylist({
			guid: playlistGuid,
			items,
		})
	}

	const setKeyChordOfItem = async (guid: PlaylistItemGuid, keyChord: Chord) => {
		return await playlistEditingApi.playlistEditingControllerTransposePlaylistItem(
			{
				guid,
				key: keyChord.data.rootNote.toString(),
			}
		)
	}

	const editPlaylistItem = async (
		guid: PlaylistItemGuid,
		data: EditPlaylistItemData
	) => {
		return await playlistEditingApi.playlistEditingControllerEditItem({
			itemGuid: guid,
			title: data.title,
			sheetData: data.sheetData,
		})
	}

	const requireItemEdit = useCallback(
		async (guid: PlaylistItemGuid) => {
			return await playlistEditingApi.playlistEditingControllerRequireItemEdit({
				itemGuid: guid,
			})
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
