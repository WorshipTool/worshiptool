import { UserGuid } from '@/interfaces/user'
import {
	VariantPackAlias,
	VariantPackGuid,
} from '@/interfaces/variant/songVariant.types'
import { Sheet } from '@pepavlin/sheet-api'
import { BasicVariantPackDto, GetSongDataOutDto } from '../../generated'
import { mapSongDataVariantApiToSongVariantDto } from '../variant/songVariant.map'
import { BasicVariantPack, SongDto } from './song.dto'

export const mapGetSongDataApiToSongDto = (api: GetSongDataOutDto): SongDto => {
	return {
		guid: api.guid,
		title: api.mainTitle,
		variants: api.variants.map((v) => mapSongDataVariantApiToSongVariantDto(v)),
		media: api.media,
		tags: api.tags,
	}
}

export const mapBasicVariantPackApiToDto = (
	api: BasicVariantPackDto
): BasicVariantPack => {
	return {
		...api,
		packGuid: api.packGuid as VariantPackGuid,
		packAlias: api.packAlias as VariantPackAlias,
		createdByGuid: api.createdByGuid as UserGuid,

		sheet: new Sheet(api.sheetData),

		// Dates
		createdAt: new Date(api.createdAt),
		updatedAt: new Date(api.updatedAt),
	}
}
