import { SongGettingApi } from '../../../../../api/generated'
import { handleApiCall } from '../../../../../tech/handleApiCall'

export const getVariantAliasFromParams = (hex: string, code: string) => {
	return `${hex}-${code}`
}

export const getVariantByAlias = async (alias: string) => {
	// const aliasApi = new UrlAliasApi()
	const variantApi = new SongGettingApi()

	const variantGuid = await handleApiCall(
		variantApi.songGettingControllerGetVariantFromAlias(alias)
	)

	const variant = await handleApiCall(
		variantApi.songGettingControllerGetSongDataByVariantGuid(variantGuid)
	)

	return variant
}
