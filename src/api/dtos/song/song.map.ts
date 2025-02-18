import { UserGuid } from '@/interfaces/user'
import {
	VariantPackAlias,
	VariantPackGuid,
} from '@/interfaces/variant/songVariant.types'
import { PlaylistGuid } from '@/types/playlist'
import { ExtendedVariantPack, SongGuid, SongLanguage } from '@/types/song'
import {
	BasicVariantPackDto,
	ExtendedVariantPackDto,
	GetSongDataOutDto,
	GetVariantDataOutDto,
} from '../../generated'
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

export const mapGetVariantDataApiToSongDto = (
	api: GetVariantDataOutDto
): SongDto => {
	return {
		guid: api.main.songGuid as SongGuid,
		title: api.main.title,
		variants: api.other.map((v) => mapBasicVariantPackApiToDto(v)),
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

		// sheet: new Sheet(api.sheetData),

		songGuid: api.songGuid as SongGuid,

		// Dates
		createdAt: new Date(api.createdAt),
		updatedAt: new Date(api.updatedAt),
	}
}

export const mapExtendedVariantPackApiToDto = (
	api: ExtendedVariantPackDto
): ExtendedVariantPack => {
	return {
		...api,
		...mapBasicVariantPackApiToDto(api),

		sources: api.sources,

		createdType: api.createdType,
		inFormat: api.inFormat,
		deleted: api.deleted,

		language: api.language as SongLanguage,
		createdForPlaylistGuid: api.createdForPlaylistGuid as PlaylistGuid,
	}
}
