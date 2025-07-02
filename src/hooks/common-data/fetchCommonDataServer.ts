import { PackGuid } from '@/api/dtos'
import { useServerApi } from '@/api/tech-and-hooks/useServerApi'
import {
	AllCommonData,
	TranslationLike,
} from '@/hooks/common-data/common-data.types'

// This all is sent on every first request... so optimize it!

export const fetchAllCommonDataServer = async (): Promise<AllCommonData> => {
	const api = await useServerApi()

	try {
		/** Get translation likes of user */
		const tLikes = await api.songUserManagementApi.getUserLikes()
		const tlFormatted: TranslationLike[] = tLikes.likes.map((tl) => ({
			packGuid: tl.packGuid as PackGuid,
		}))

		/** Get teams of user */
		const teams = await api.teamMembersApi.getTeamsOfUser()

		/** Get playlist of user */
		// const playlists = await handleServerApiCall(
		// 	Api.getPlaylistsOfUser()
		// )

		/** Get all subdomains */
		const subdomains = await api.teamGettingApi.getAllSubdomains()

		/** Get user permissions */
		// const p = await handleServerApiCall(
		// 	Api.getUserPermissions()
		// )
		// const pFormatted = p.map((p) => ({
		// 	type: p.type as PermissionType<PermissionsTypes>,
		// 	payload: apiToPermissionPayload(p.payload),
		// 	guid: p.guid,
		// }))
		// can be too large

		/** Get user favourites */
		// const favourites = await handleServerApiCall(
		// 	Api.getFavourites()
		// )

		return {
			translationLikes: tlFormatted,
			teamsOfUser: teams.teams,
			// playlistsOfUser: playlists.playlists,
			allsubdomains: subdomains.aliases,
			// permissionsOfUser: pFormatted,
			// favourites: favourites,
		}
	} catch (e) {
		return {
			translationLikes: [],
			teamsOfUser: [],
			// playlistsOfUser: [],
			allsubdomains: [],
			// permissionsOfUser: [],
			// favourites: { items: [], selectionGuid: '' },
		}
	}
}
