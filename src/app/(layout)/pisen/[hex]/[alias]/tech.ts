import { useServerApi } from '@/hooks/api/useServerApi'
import { GetVariantDataOutDto } from '../../../../../api/generated'
import { handleApiCall } from '../../../../../tech/handleApiCall'

export const getVariantAliasFromParams = (hex: string, code: string) => {
	return `${hex}-${code}`
}

/** Server side func */
export const getVariantByAlias = async (
	alias: string
): Promise<GetVariantDataOutDto> => {
	const { songGettingApi } = await useServerApi()

	const variant = await handleApiCall(
		songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)
	)

	return variant
}
