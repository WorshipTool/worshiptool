import { UserGuid } from '@/interfaces/user'
import { BasicVariantPack, SongGuid } from '@/types/song'
import {
	VariantPackAlias,
	VariantPackGuid,
} from '../../../interfaces/variant/songVariant.types'
import { SongDataVariant } from '../../generated'

export const mapSongDataVariantApiToSongVariantDto = (
	api: SongDataVariant
): BasicVariantPack => {
	return {
		...api,
		// guid: api.guid as SongVariantGuid,
		packGuid: api.packGuid as VariantPackGuid,

		packAlias: api.alias as VariantPackAlias,
		// sheet: new Sheet(api.sheetData),
		createdByGuid: api.createdByGuid as UserGuid,
		// createdForPlaylistGuid: api.createdForPlaylistGuid,
		createdAt: new Date(api.packCreatedAt),
		updatedAt: new Date(api.createdAt),
		title: api.prefferedTitle,
		songGuid: api.songGuid as SongGuid,

		// packCreatedAt: new Date(api.packCreatedAt),
	}
}
