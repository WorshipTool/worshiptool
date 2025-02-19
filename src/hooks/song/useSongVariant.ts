'use client'

import { useMemo } from 'react'
import {
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
} from '../../api/dtos'
import { useApiStateEffect } from '../../tech/ApiState'
import { handleApiCall } from '../../tech/handleApiCall'
import { useApi } from '../api/useApi'
import useAuth from '../auth/useAuth'

export const useSongVariant = (variantGuid: string) => {
	const guid = useMemo(() => variantGuid, [variantGuid])

	// Prepare API
	const { songGettingApi } = useApi()

	const [state, reload] = useApiStateEffect(async () => {
		const data = await handleApiCall(
			songGettingApi.songGettingControllerGetSongDataByVariantGuid(guid)
		)

		// Find current variant
		const variant = data.variants.find((v) => v.guid === guid)
		if (!variant) return null
		const currentVariant = mapSongDataVariantApiToSongVariantDto(variant)

		const song = mapGetSongDataApiToSongDto(data)
		return {
			song,
			currentVariant,
		}
	}, [guid])

	const { user } = useAuth()
	const isCreatedByMe = useMemo(() => {
		if (!user) return false
		if (!state.data?.currentVariant) return false
		return state.data.currentVariant.createdByGuid === user.guid
	}, [state.data?.currentVariant, user])

	return {
		loading: state.loading,
		state,
		reload,
		song: state.data?.song,
		isCreatedByMe,
		...state.data?.currentVariant,
		title: state.data?.currentVariant.title,
		variant: state.data?.currentVariant,
	}
}
