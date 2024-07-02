import { Sheet } from '@pepavlin/sheet-api'
import { CreatorDto } from '../creator/CreatorDto'
import { SourceDto } from '../source/SourceDto'

export type SongVariantDto = {
	guid: string
	packGuid: string
	sheetData: string
	sheetText: string
	sheet: Sheet
	preferredTitle: string
	titles: string[]
	verified: boolean
	public: boolean
	inFormat: boolean
	deleted: boolean
	createdBy: string
	createdByLoader: boolean
	sources: SourceDto[]
	creators: CreatorDto[]
	alias: string
	language: string
	tags: string[]
}
