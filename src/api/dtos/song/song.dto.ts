import { UserGuid } from '@/interfaces/user'
import { PackTranslationType, SongGuid, SongLanguage } from '@/types/song'
import {
	VariantPackAlias,
	VariantPackGuid,
} from '../../../interfaces/variant/songVariant.types'
import { MediaDto } from '../media/MediaDto'

export type SongDto = {
	guid: string
	title: string
	variants: BasicVariantPack[]
	media: MediaDto[]
	tags: string[]
}

export type BasicVariantPack = {
	// Basic info
	packGuid: VariantPackGuid
	packAlias: VariantPackAlias
	title: string
	sheetData: string
	// sheet: Sheet
	songGuid: SongGuid

	// Additional info
	verified: boolean
	public: boolean
	language: SongLanguage
	translationType: PackTranslationType

	// Dates
	createdAt: Date
	updatedAt: Date

	// Created by
	createdByGuid: UserGuid
	createdByLoader: boolean
}
