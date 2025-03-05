import { BasicVariantPack as Basic } from '@/api/dtos'
import { SourceDto } from '@/api/dtos/source/SourceDto'
import { PlaylistGuid } from '@/types/playlist'
import {
	CreatedType,
	VariantPackAlias as VPA,
	VariantPackGuid as VPG,
} from '../../interfaces/variant/songVariant.types'

export type VariantPackGuid = VPG
export type VariantPackAlias = VPA

export type BasicVariantPack = Basic

export type SongLanguage = string & { readonly brand: unique symbol }

export type ExtendedVariantPack = BasicVariantPack & {
	deleted: boolean
	inFormat: boolean
	createdType: CreatedType
	language: SongLanguage | null

	createdForPlaylistGuid: PlaylistGuid | null

	sources: SourceDto[]
}

export enum PackTranslationType {
	Unknown = 0,
	Original = 1,
	Translation = 2,
	OfficialTranslation = 3,
}
