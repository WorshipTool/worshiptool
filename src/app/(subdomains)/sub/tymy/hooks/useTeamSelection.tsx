import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import { mapPlaylistItemOutDtoApiToPlaylistItemDto } from '@/api/dtos/playlist/playlist.map'
import { TeamGuid } from '@/app/(subdomains)/sub/tymy/tech'
import { useApi } from '@/hooks/api/useApi'
import usePlaylist from '@/hooks/playlist/usePlaylist'
import {
	PlaylistGuid,
	PlaylistItemDto,
} from '@/interfaces/playlist/playlist.types'
import { handleApiCall } from '@/tech/handleApiCall'

export const useTeamSelection = (guid: PlaylistGuid, teamGuid: TeamGuid) => {
	const selection = usePlaylist(guid)

	const { teamEditingApi } = useApi()

	const addPacks = async (packGuids: VariantPackGuid[]) => {
		const newItems: PlaylistItemDto[] = []
		for (const packGuid of packGuids) {
			try {
				const r = await handleApiCall(
					teamEditingApi.teamSelectionControllerAddPackToTeam({
						packGuid: packGuid,
						teamGuid,
					})
				)

				if (!r) return false
				const data = mapPlaylistItemOutDtoApiToPlaylistItemDto(r)

				if (data) newItems.push(data)
			} catch (e) {}
		}

		// Add new items to the list

		selection._setItems((items) => [...items, ...newItems])
	}

	const removePacks = async (packGuids: VariantPackGuid[]) => {
		const newItems: VariantPackGuid[] = []
		for (const packGuid of packGuids) {
			try {
				const data = await handleApiCall(
					teamEditingApi.teamSelectionControllerRemovePackFromTeam({
						packGuid: packGuid,
						teamGuid,
					})
				)
				if (data) newItems.push(packGuid)
			} catch (e) {
				return false
			}
		}

		// Remove items from the list
		selection._setItems((items) =>
			items.filter((i) => !newItems.includes(i.variant.packGuid))
		)
	}

	const songNeedToBeCopiedToEdit = (variant: SongVariantDto): boolean => {
		return variant.public
	}

	return {
		...selection,
		addVariant: undefined,
		removeVariant: undefined,
		addPacks,
		removePacks,
		songNeedToBeCopiedToEdit,
	}
}
