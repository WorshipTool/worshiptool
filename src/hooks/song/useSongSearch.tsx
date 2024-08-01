import { useCallback } from 'react'
import { mapSongVariantDataOutDtoToSongVariantDto } from '../../api/dtos'
import { handleApiCall } from '../../tech/handleApiCall'
import { useApi } from '../api/useApi'
import useAuth from '../auth/useAuth'

type useSongSearchProps = {
	searchKey: string
	page?: number
	signal?: AbortSignal
}

export default function useSongSearch() {
	const { songGettingApi } = useApi()
	const { user } = useAuth()

	const getSongs = useCallback(
		async (additionalParams: useSongSearchProps) => {
			try {
				const result = await handleApiCall(
					songGettingApi.songGettingControllerGetBySearch(
						additionalParams.searchKey,
						additionalParams.page || 0,
						{
							signal: additionalParams.signal,
						}
					)
				)
				// Created by user first
				const ordered = result.sort((a, b) => {
					if (a.createdBy === user?.guid) return -1
					if (b.createdBy === user?.guid) return 1
					return 0
				})

				return ordered.map((s) => mapSongVariantDataOutDtoToSongVariantDto(s))
			} catch (e) {
				console.log(e)
			}

			return []
		},
		[songGettingApi, user]
	)

	return getSongs
}
