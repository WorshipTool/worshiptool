'use client'
import {
	BasicVariantPack,
	mapBasicVariantPackApiToDto,
} from '../../../../../api/dtos'
import { useApi } from '../../../../../api/tech-and-hooks/useApi'
import { useApiStateEffect } from '../../../../../tech/ApiState'

export default function useRecommendedSongs() {
	const { songGettingApi } = useApi()

	const [state] = useApiStateEffect<BasicVariantPack[]>(async () => {
		const result =
			await songGettingApi.songGettingControllerGetRecommendedSongs()
		return result.variants.map((v) => mapBasicVariantPackApiToDto(v))
	}, [])

	return {
		data: state.data || [],
		isLoading: state.loading,
		isError: state.error,
		isSuccess: state.success,
	}
}
