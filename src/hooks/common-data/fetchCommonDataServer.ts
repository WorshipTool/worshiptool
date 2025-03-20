import { PackGuid } from '@/api/dtos'
import { useServerApi } from '@/hooks/api/useServerApi'
import {
	AllCommonData,
	TranslationLike,
} from '@/hooks/common-data/common-data.types'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'

export const fetchAllCommonDataServer = async (): Promise<AllCommonData> => {
	const api = await useServerApi()

	try {
		const tLikes = await handleServerApiCall(
			api.songUserManagementApi.songTranslationLikeControllerGetUserLikes()
		)

		const tlFormatted: TranslationLike[] = tLikes.likes.map((tl) => ({
			packGuid: tl.packGuid as PackGuid,
		}))

		return {
			translationLikes: tlFormatted,
		}
	} catch (e) {
		return {
			translationLikes: [],
		}
	}
}
