import { UserGuid } from '@/interfaces/user'
import {
	VariantPackAlias,
	VariantPackGuid,
} from '@/interfaces/variant/songVariant.types'
import { PlaylistGuid } from '@/types/playlist'
import {
	ExtendedVariantPack,
	PackTranslationType,
	SongGuid,
	SongLanguage,
} from '@/types/song'
import {
	BasicVariantPackDto,
	ExtendedVariantPackDto,
	GetVariantDataOutDto,
} from '../../generated'
import { BasicVariantPack, SongDto } from './song.dto'

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

		language: api.language as SongLanguage,
		songGuid: api.songGuid as SongGuid,

		translationType: api.translationType as PackTranslationType,
		ggValidated: api.ggValidated,

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

		createdForPlaylistGuid: api.createdForPlaylistGuid as PlaylistGuid,
	}
}
