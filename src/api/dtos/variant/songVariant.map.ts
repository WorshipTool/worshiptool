import { UserGuid } from '@/interfaces/user'
import { Sheet } from '@pepavlin/sheet-api'
import {
	SongVariantDto,
	SongVariantGuid,
	VariantPackAlias,
	VariantPackGuid,
} from '../../../interfaces/variant/songVariant.types'
import { SongDataVariant } from '../../generated'

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
