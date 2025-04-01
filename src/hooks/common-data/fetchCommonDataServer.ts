import { PackGuid } from '@/api/dtos'
import { apiToPermissionPayload } from '@/api/dtos/permission'
import { useServerApi } from '@/hooks/api/useServerApi'
import {
	AllCommonData,
	TranslationLike,
} from '@/hooks/common-data/common-data.types'
import {
	PermissionsTypes,
	PermissionType,
} from '@/hooks/permissions/permission.types'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'

export const fetchAllCommonDataServer = async (): Promise<AllCommonData> => {
	const api = await useServerApi()

	try {
		/** Get translation likes of user */
		const tLikes = await handleServerApiCall(
			api.songUserManagementApi.songTranslationLikeControllerGetUserLikes()
		)
		const tlFormatted: TranslationLike[] = tLikes.likes.map((tl) => ({
			packGuid: tl.packGuid as PackGuid,
		}))

		/** Get teams of user */
		const teams = await handleServerApiCall(
			api.teamMembersApi.teamMemberControllerGetTeamsOfUser()
		)

		/** Get playlist of user */
		const playlists = await handleServerApiCall(
			api.playlistGettingApi.playlistGettingControllerGetPlaylistsOfUser()
		)

		/** Get all subdomains */
		const subdomains = await handleServerApiCall(
			api.teamGettingApi.teamGettingControllerGetAllSubdomains()
		)

		/** Get user permissions */
		const p = await handleServerApiCall(
			api.permissionApi.permissionControllerGetUserPermissions()
		)
		const pFormatted = p.map((p) => ({
			type: p.type as PermissionType<PermissionsTypes>,
			payload: apiToPermissionPayload(p.payload),
			guid: p.guid,
		}))

		/** Get user favourites */
		const favourites = await handleServerApiCall(
			api.songFavouritesApi.songFavouritesControllerGetFavourites()
		)

		return {
			translationLikes: tlFormatted,
			teamsOfUser: teams.teams,
			playlistsOfUser: playlists.playlists,
			allsubdomains: subdomains.aliases,
			permissionsOfUser: pFormatted,
			favourites: favourites,
		}
	} catch (e) {
		return {
			translationLikes: [],
			teamsOfUser: [],
			playlistsOfUser: [],
			allsubdomains: [],
			permissionsOfUser: [],
			favourites: { items: [], selectionGuid: '' },
		}
	}
}
