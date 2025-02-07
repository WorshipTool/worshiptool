import { useCallback } from 'react'
import { BasicVariantPack, mapBasicVariantPackApiToDto } from '../../api/dtos'
import { handleApiCall } from '../../tech/handleApiCall'
import { useApi } from '../api/useApi'
import useAuth from '../auth/useAuth'

type useSongSearchProps = {
	searchKey: string
	page?: number
	signal?: AbortSignal
	useSmartSearch?: boolean
}

export default function useSongSearch() {
	const { songGettingApi, packEmbeddingApi } = useApi()
	const { user } = useAuth()

	const getSongs = useCallback(
		async (
			additionalParams: useSongSearchProps
		): Promise<BasicVariantPack[]> => {
			try {
				const result = !additionalParams.useSmartSearch
					? await handleApiCall(
							songGettingApi.songGettingControllerGetBySearch(
								additionalParams.searchKey,
								additionalParams.page || 0,
								{
									signal: additionalParams.signal,
								}
							)
					  )
					: await handleApiCall(
							packEmbeddingApi.packEmbeddingSearchControllerSearch(
								additionalParams.searchKey,
								additionalParams.page || 0,
								{
									signal: additionalParams.signal,
								}
							)
					  )
				// Created by user first
				const ordered = result.sort((a, b) => {
					if (a.createdByGuid === user?.guid) return -1
					if (b.createdByGuid === user?.guid) return 1
					return 0
				})

				return ordered.map((s) => mapBasicVariantPackApiToDto(s))
			} catch (e) {
				console.log(e)
			}

			return []
		},
		[songGettingApi, user]
	)

	return getSongs
}
