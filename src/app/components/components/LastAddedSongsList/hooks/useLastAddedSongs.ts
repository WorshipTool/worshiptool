'use client'
import {
	BasicVariantPack,
	mapBasicVariantPackApiToDto,
} from '../../../../../api/dtos'
import { useApi } from '../../../../../hooks/api/useApi'
import { useApiStateEffect } from '../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../tech/handleApiCall'

export default function useLastAddedSongs() {
	const { songGettingApi } = useApi()

	const [state] = useApiStateEffect<BasicVariantPack[]>(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerGetLastAdded()
		)
		return result.map((v) => mapBasicVariantPackApiToDto(v))
	}, [])

	return {
		data: state.data || [],
		isLoading: state.loading,
		isError: state.error,
		isSuccess: state.success,
	}
}
