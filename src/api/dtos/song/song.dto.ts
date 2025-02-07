import { UserGuid } from '@/interfaces/user'
import { Sheet } from '@pepavlin/sheet-api'
import {
	SongVariantDto,
	VariantPackAlias,
	VariantPackGuid,
} from '../../../interfaces/variant/songVariant.types'
import { MediaDto } from '../media/MediaDto'

export type SongDto = {
	guid: string
	title: string
	variants: SongVariantDto[]
	media: MediaDto[]
	tags: string[]
}

export type BasicVariantPack = {
	// Basic info
	packGuid: VariantPackGuid
	packAlias: VariantPackAlias
	title: string
	sheetData: string
	sheet: Sheet

	// Additional info
	verified: boolean
	public: boolean

	// Dates
	createdAt: Date
	updatedAt: Date

	// Created by
	createdByGuid: UserGuid
	createdByLoader: boolean
}
