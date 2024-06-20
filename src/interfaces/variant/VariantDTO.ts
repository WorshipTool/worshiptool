import { Section } from '@pepavlin/sheet-api/lib/models/song/section'
import { Creator } from '../song/creator'
import { Source } from '../song/source'

export interface VariantDTO {
	guid: string
	songGuid: string
	sheetData: string
	sheetText: string
	sections: Section[]
	preferredTitle: string
	titles: string[]
	verified: boolean
	createdBy: string
	createdByLoader: boolean
	sources: Source[]
	creators: Creator[]
	deleted: boolean
}

export enum CreatedType {
	'Manual' = 0,
	'Scraped' = 1,
	'Parsed' = 2,
}
