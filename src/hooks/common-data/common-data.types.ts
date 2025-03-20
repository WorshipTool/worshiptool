import { PackGuid } from '@/api/dtos'

export type AllCommonData = {
	translationLikes: TranslationLike[]
}

export type TranslationLike = {
	packGuid: PackGuid
}
