import { UserGuid } from '@/interfaces/user'
import { Sheet } from '@pepavlin/sheet-api'
import {
	SongVariantDto,
	SongVariantGuid,
	VariantPackAlias,
	VariantPackGuid,
} from '../../../interfaces/variant/songVariant.types'
import { SongDataVariant, SongVariantDataOutDto } from '../../generated'

export const mapSongDataVariantApiToSongVariantDto = (
	api: SongDataVariant
): SongVariantDto => {
	return {
		...api,
		guid: api.guid as SongVariantGuid,
		packGuid: api.packGuid as VariantPackGuid,

		preferredTitle: api?.prefferedTitle,
		packAlias: api.alias as VariantPackAlias,
		sheet: new Sheet(api.sheetData),
		createdBy: api.createdByGuid as UserGuid,
		createdForPlaylistGuid: api.createdForPlaylistGuid,
		createdAt: new Date(api.createdAt),
		packCreatedAt: new Date(api.packCreatedAt),
	}
}

export const mapSongVariantDataOutDtoToSongVariantDto = ({
	prefferedTitle,
	...api
}: SongVariantDataOutDto): SongVariantDto => {
	return {
		...api,

		preferredTitle: prefferedTitle,
		sheet: new Sheet(api.sheetData),

		guid: api.guid as SongVariantGuid,
		createdBy: api.createdBy as UserGuid,
		packGuid: api.packGuid as VariantPackGuid,
		packAlias: api.alias as VariantPackAlias,
		createdForPlaylistGuid: api.createdForPlaylistGuid,

		createdAt: new Date(api.createdAt),
		packCreatedAt: new Date(api.packCreatedAt),
	}
}

// export const mapSearchSongDataApiToSongVariantDto = (
//     data: SearchSongData
// ): SongVariantDto => {
//     return {
//         ...data.variant,
//         sheet: new Sheet(data.variant.sheetData),
//         preferredTitle: data.variant.prefferedTitle,
//         createdBy: data.variant.createdByGuid,
//         public: data.variant.verified || data.variant.createdByLoader
//     };
// };

// export const mapSearchResultApiToSongVariantDtoArr = (
//     result: SearchResult
// ): SongVariantDto[] => {
//     return result.songs.map((data) => {
//         const variant = data.variant;
//         const v: SongVariantDto = {
//             ...variant,
//             sheet: new Sheet(variant.sheetData),
//             preferredTitle: variant.prefferedTitle,
//             createdBy: variant.createdByGuid,
//             alias: data.alias,
//             public: variant.verified || variant.createdByLoader
//         };
//         return v;
//     });
// };
