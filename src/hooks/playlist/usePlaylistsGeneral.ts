import { useApi } from '@/hooks/api/useApi'
import { VariantPackGuid } from '@/interfaces/variant/VariantDTO'
import { Chord } from '@pepavlin/sheet-api'
import { mapPlaylistDataOutDtoToPlaylistDto } from '../../api/dtos/playlist/playlist.map'
import {
	GetSearchInPlaylistResult,
	ReorderPlaylistInDto,
} from '../../api/generated'
import Playlist, {
	PlaylistGuid,
	PlaylistItemGuid,
} from '../../interfaces/playlist/playlist.types'
import { handleApiCall } from '../../tech/handleApiCall'

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

	const createPlaylist = async () => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerCreatePlaylist()
		)
	}

	const deletePlaylist = async (guid: PlaylistGuid) => {
		return await handleApiCall(
			playlistEditingApi.playlistEditingControllerDeletePlaylist(guid)
		)
	}

	const getPlaylistByGuid = async (guid: PlaylistGuid): Promise<Playlist> => {
		const result = await handleApiCall(
			playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(guid)
		)
		return mapPlaylistDataOutDtoToPlaylistDto(result)
	}

	const searchInPlaylistByGuid = async (
		playlistGuid: PlaylistGuid,
		searchString: string
	): Promise<GetSearchInPlaylistResult> => {
		return await handleApiCall(
			playlistGettingApi.playlistGettingControllerSearchInPlaylist(
				searchString,
				playlistGuid
			)
		)
	}

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

	return {
		addVariantToPlaylist,
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
		// loading
	}
}
