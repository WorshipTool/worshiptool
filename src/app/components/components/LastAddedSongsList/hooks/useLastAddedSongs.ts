'use client'
import {
	BasicVariantPack,
	mapBasicVariantPackApiToDto,
} from '../../../../../api/dtos'
import { useApi } from '../../../../../api/tech-and-hooks/useApi'
import { useApiStateEffect } from '../../../../../tech/ApiState'

export default function useLastAddedSongs() {
	const { songGettingApi } = useApi()

	const [state] = useApiStateEffect<BasicVariantPack[]>(async () => {
		const result = await songGettingApi.getLastAdded()
		return result.map((v) => mapBasicVariantPackApiToDto(v))
	}, [])

	return {
		data: state.data || [],
		isLoading: state.loading,
		isError: state.error,
		isSuccess: state.success,
	}
}
