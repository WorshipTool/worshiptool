import { mapBasicVariantPackApiToDto } from '@/api/dtos/song/song.map'
import { SearchSongPacksDto } from '@/api/generated'
import { BasicVariantPack } from '@/types/song'

export type SearchSongDto = {
	original?: BasicVariantPack
	found: BasicVariantPack[]
	other?: BasicVariantPack[]
}

export const mapSearchSongPacksApiToDto = (
	api: SearchSongPacksDto
): SearchSongDto => {
	return {
		original: api.original
			? mapBasicVariantPackApiToDto(api.original)
			: undefined,
		found: api.found.map((v) => mapBasicVariantPackApiToDto(v)),
		other: api.other?.map((v) => mapBasicVariantPackApiToDto(v)),
	}
}
