import {
	mapSearchSongPacksApiToDto,
	SearchSongDto,
} from '@/api/dtos/song/song.search.dto'
import { SearchKey } from '@/types/song/search.types'
import { useCallback } from 'react'
import { mapBasicVariantPackApiToDto } from '../../api/dtos'
import { handleApiCall } from '../../tech/handleApiCall'
import { useApi } from '../api/useApi'
import useAuth from '../auth/useAuth'

type useSongSearchProps = {
	page?: number
	signal?: AbortSignal
	useSmartSearch?: boolean
}

type GetSongFunction = (
	searchKey: SearchKey,
	additionalParams?: useSongSearchProps
) => Promise<SearchSongDto[]>

export default function useSongSearch() {
	const { songGettingApi, packEmbeddingApi, songSearchingApi } = useApi()
	const { user } = useAuth()

	const getSongs: GetSongFunction = useCallback(
		async (
			searchKey: SearchKey,
			additionalParams?: useSongSearchProps
		): Promise<SearchSongDto[]> => {
			try {
				// Handle smart search
				if (additionalParams?.useSmartSearch) {
					return (
						await handleApiCall(
							packEmbeddingApi.packEmbeddingSearchControllerSearch(
								searchKey,
								additionalParams?.page || 0,
								{
									signal: additionalParams.signal,
								}
							)
						)
					).map((s) => ({
						found: [mapBasicVariantPackApiToDto(s)],
					}))
				}

				const result = await handleApiCall(
					songSearchingApi.songSearchingControllerSearch(
						searchKey,
						additionalParams?.page || 0,
						{
							signal: additionalParams?.signal,
						}
					)
				)

				return result.map((d) => mapSearchSongPacksApiToDto(d))
			} catch (e) {
				console.log(e)
			}

			return []
		},
		[songGettingApi, user, packEmbeddingApi]
	)

	return getSongs
}
