import { mapBasicVariantPackApiToDto } from '@/api/dtos/song'
import { note } from '@pepavlin/sheet-api'
import { TeamGuid } from '../../../app/(submodules)/(teams)/sub/tymy/tech'
import PlaylistDto, {
	PlaylistGuid,
	PlaylistItemDto,
	PlaylistItemGuid,
} from '../../../interfaces/playlist/playlist.types'
import { PlaylistDataOutDto, PlaylistItemOutDto } from '../../generated'

export const mapPlaylistItemOutDtoApiToPlaylistItemDto = (
	api: PlaylistItemOutDto
): PlaylistItemDto => {
	return {
		guid: api.guid as PlaylistItemGuid,
		toneKey: api.toneKey as note,
		order: api.order,
		pack: mapBasicVariantPackApiToDto(api.pack),
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
		teamGuid: api.teamGuid as TeamGuid | undefined,
	}
}
