import { useServerApi } from '@/api/tech-and-hooks/useServerApi'
import { GetVariantDataOutDto } from '../../../../../api/generated'

export const getVariantAliasFromParams = (hex: string, code: string) => {
	return `${hex}-${code}`
}

/** Server side func */
export const getVariantByAlias = async (
	alias: string
): Promise<GetVariantDataOutDto> => {
	const { songGettingApi } = await useServerApi()

	const variant =
		await songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)

	return variant
}
