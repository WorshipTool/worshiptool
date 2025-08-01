import { VariantPackGuid } from '@/api/dtos'
import { mapPlaylistItemOutDtoApiToPlaylistItemDto } from '@/api/dtos/playlist/playlist.map'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { TeamGuid } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import usePlaylist from '@/hooks/playlist/usePlaylist'
import {
	PlaylistGuid,
	PlaylistItemDto,
} from '@/interfaces/playlist/playlist.types'
import { ExtendedVariantPack } from '@/types/song'

export const useTeamSelection = (guid: PlaylistGuid, teamGuid: TeamGuid) => {
	const selection = usePlaylist(guid)

	const { teamEditingApi } = useApi()

	const addPacks = async (packGuids: VariantPackGuid[]) => {
		const newItems: PlaylistItemDto[] = []
		for (const packGuid of packGuids) {
			try {
				const r = await teamEditingApi.addPackToTeam({
					packGuid: packGuid,
					teamGuid,
				})

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
				const data = await teamEditingApi.removePackFromTeam({
					packGuid: packGuid,
					teamGuid,
				})
				if (data) newItems.push(packGuid)
			} catch (e) {
				return false
			}
		}

		// Remove items from the list
		selection._setItems((items) =>
			items.filter((i) => !newItems.includes(i.pack.packGuid))
		)
	}

	const songNeedToBeCopiedToEdit = (variant: ExtendedVariantPack): boolean => {
		return variant.createdForPlaylistGuid !== guid
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
