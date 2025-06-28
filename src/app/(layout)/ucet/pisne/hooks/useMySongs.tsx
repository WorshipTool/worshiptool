import { useState } from 'react'
import {
	BasicVariantPack,
	mapBasicVariantPackApiToDto,
} from '../../../../../api/dtos'
import { useApi } from '../../../../../api/tech-and-hooks/useApi'
import useAuth from '../../../../../hooks/auth/useAuth'
import { useApiStateEffect } from '../../../../../tech/ApiState'

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
		const result = await songGettingApi.songGettingControllerGetSongListOfUser()
		return result.variants.map((variant) => {
			return mapBasicVariantPackApiToDto(variant)
		})
	}, [isLoggedIn])

	return {
		variants: apiState.data || [],
		loaded: !apiState.loading,
	}
}
