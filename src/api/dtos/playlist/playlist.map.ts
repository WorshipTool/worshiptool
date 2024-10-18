import { note } from '@pepavlin/sheet-api'
import PlaylistDto, {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '../../../interfaces/playlist/playlist.types'
import { PlaylistDataOutDto, PlaylistItemOutDto } from '../../generated'
import { mapSongVariantDataOutDtoToSongVariantDto } from '../variant'

export const mapPlaylistItemOutDtoApiToPlaylistItemDto = (
	api: PlaylistItemOutDto
): PlaylistItemDto => {
	return {
		guid: api.guid as PlaylistItemGuid,
		toneKey: api.toneKey as note,
		order: api.order,
		variant: mapSongVariantDataOutDtoToSongVariantDto(api.variant),
	}
}

export const mapPlaylistDataOutDtoToPlaylistDto = (
	api: PlaylistDataOutDto
): PlaylistDto => {
	return {
		guid: api.guid as PlaylistGuid,
		title: api.title,
		items: api.items.map((item) =>
			mapPlaylistItemOutDtoApiToPlaylistItemDto(item)
		),
		ownerGuid: api.ownerGuid,
		teamAlias: api.teamAlias,
		teamGuid: api.teamGuid,
	}
}
