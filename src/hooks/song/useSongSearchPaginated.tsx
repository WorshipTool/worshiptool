import { SearchSongDto } from '@/api/dtos/song/song.search.dto'
import useSongSearch from '@/hooks/song/useSongSearch'
import usePagination from '@/hooks/usePagination'
import { SearchKey } from '@/types/song/search.types'
import { useCallback, useEffect, useState } from 'react'

const controller = new AbortController()
export default function useSongSearchPaginated() {
	const [loading, setLoading] = useState<boolean>(false)
	const [nextLoading, setNextLoading] = useState<boolean>(false)
	const [enableLoadNext, setEnableLoadNext] = useState<boolean>(false)

	const [searchString, setSearchString] = useState<string>('')
	const [useSmartSearch, setUseSmartSearch] = useState<boolean>(false)

	const searchSongs = useSongSearch()

	const func = useCallback(
		(
			page: number,
			resolve: (a: SearchSongDto[]) => void,
			arr: SearchSongDto[]
		) => {
			searchSongs(searchString as SearchKey, {
				page,
				signal: controller.signal,
				useSmartSearch,
			})
				.then((data) => {
					setLoading(false)
					setNextLoading(false)
					resolve(data)
				})
				.catch(() => {
					resolve([])
					setNextLoading(false)
				})
		},
		[searchString, searchSongs, useSmartSearch]
	)

	const {
		nextPage: loadNext,
		loadPage,
		data: songs,
		pagedData: pagedSongs,
		nextExists,
	} = usePagination<SearchSongDto>(func)

	const search = (searchString: string, useSmartSearch: boolean) => {
		setSearchString(searchString)
		setUseSmartSearch(useSmartSearch)
	}

	useEffect(() => {
		loadPage(0, true).finally(() => {
			setEnableLoadNext(true)
		})
	}, [searchString, useSmartSearch])
	return {
		search,
		loadNext,
		existsNext: nextExists,
		songs,
	}
}
