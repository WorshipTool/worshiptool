import { PackGuid } from '@/api/dtos'
import { TranslationLikeItemOutDto } from '@/api/generated'
import { TranslationLike } from '@/hooks/common-data/common-data.types'

export const mapTranslationLikeApiToDto = (
	api: TranslationLikeItemOutDto
): TranslationLike => ({
	packGuid: api.packGuid as PackGuid,
})
