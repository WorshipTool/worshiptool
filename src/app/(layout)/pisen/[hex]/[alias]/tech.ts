import {
	GetVariantDataOutDto,
	SongGettingApi,
} from '../../../../../api/generated'
import { handleApiCall } from '../../../../../tech/handleApiCall'

export const getVariantAliasFromParams = (hex: string, code: string) => {
	return `${hex}-${code}`
}

export const getVariantByAlias = async (
	alias: string
): Promise<GetVariantDataOutDto> => {
	// const aliasApi = new UrlAliasApi()
	const gettingApi = new SongGettingApi()

	// const variantGuid = await handleApiCall(
	// 	gettingApi.songGettingControllerGetVariantFromAlias(alias)
	// )

	const variant = await handleApiCall(
		gettingApi.songOneGettingControllerGetVariantDataByAlias(alias)
	)

	return variant
}
