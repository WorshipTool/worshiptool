import { useState } from 'react'
import {
	BasicVariantPack,
	mapBasicVariantPackApiToDto,
} from '../../../../../api/dtos'
import { useApi } from '../../../../../hooks/api/useApi'
import useAuth from '../../../../../hooks/auth/useAuth'
import { useApiStateEffect } from '../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../tech/handleApiCall'

interface IUseMySongs {
	variants: BasicVariantPack[]
	loaded: boolean
}

export default function useMySongs(): IUseMySongs {
	const { isLoggedIn } = useAuth()
	const { songGettingApi } = useApi()

	const [loaded, setLoaded] = useState(false)
	const [apiState] = useApiStateEffect(async () => {
		if (!isLoggedIn) return
		const result = await handleApiCall(
			songGettingApi.songGettingControllerGetSongListOfUser()
		)
		return result.variants.map((variant) => {
			return mapBasicVariantPackApiToDto(variant)
		})
	}, [isLoggedIn])

	return {
		variants: apiState.data || [],
		loaded: !apiState.loading,
	}
}
