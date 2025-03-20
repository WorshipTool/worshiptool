import { UserGuid } from '@/interfaces/user'
import { Sheet } from '@pepavlin/sheet-api'
import { CreatorDto } from '../../api/dtos/creator/CreatorDto'
import { SourceDto } from '../../api/dtos/source/SourceDto'

export type SongVariantGuid = string & { readonly brand: unique symbol }

export type VariantPackGuid = string & { readonly brand: unique symbol }
export type PackGuid = VariantPackGuid

export type VariantPackAlias = string & { readonly brand: unique symbol }

export enum CreatedType {
	'Manual' = 0,
	'Scraped' = 1,
	'Parsed' = 2,
}

export type SongVariantDto = {
	guid: SongVariantGuid
	packGuid: VariantPackGuid
	packAlias: VariantPackAlias
	// songGuid: SongGuid
	sheetData: string
	sheetText: string
	sheet: Sheet
	preferredTitle: string
	titles: string[]

	createdBy: UserGuid
	createdByLoader: boolean

	createdForPlaylistGuid: string | null

	sources: SourceDto[]
	creators: CreatorDto[]
	tags: string[]

	createdType: CreatedType

	verified: boolean
	public: boolean
	inFormat: boolean
	deleted: boolean

	language: string | null

	createdAt: Date
	packCreatedAt: Date
}
