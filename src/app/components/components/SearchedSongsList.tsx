'use client'
import { Box, Button, LinearProgress, Typography } from '@/common/ui'
import { Sync } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import ContainerGrid from '../../../common/components/ContainerGrid'
import SongListCards from '../../../common/components/songLists/SongListCards/SongListCards'
import { Gap } from '../../../common/ui/Gap/Gap'
import useSongSearch from '../../../hooks/song/useSongSearch'
import usePagination from '../../../hooks/usePagination'
import normalizeSearchText from '../../../tech/normalizeSearchText'

import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { SongVariantDto } from '../../../api/dtos'

interface SearchedSongsListProps {
	searchString: string
}
const controller = new AbortController()

const SearchedSongsList = memo(({ searchString }: SearchedSongsListProps) => {
	const loadNextLevelRef = useRef(null)

	const [loading, setLoading] = useState<boolean>(false)
	const [nextLoading, setNextLoading] = useState<boolean>(false)
	const [enableLoadNext, setEnableLoadNext] = useState<boolean>(false)

	const searchSongs = useSongSearch()

	const func = useCallback(
		(
			page: number,
			resolve: (a: SongVariantDto[]) => void,
			arr: SongVariantDto[]
		) => {
			searchSongs({
				searchKey: searchString,
				page,
				signal: controller.signal,
			}).then((data) => {
				const filtered = data.filter((v) => {
					return !arr.find((s) => s.guid == v.guid)
				})
				setLoading(false)
				setNextLoading(false)
				resolve(filtered)
			})
		},
		[searchString, searchSongs]
	)

	const {
		nextPage: loadNext,
		loadPage,
		data: songs,
		pagedData: pagedSongs,
		nextExists,
	} = usePagination<SongVariantDto>(func)

	useEffect(() => {
		setEnableLoadNext(false)
		setLoading(true)
	}, [searchString])

	useIsInViewport(loadNextLevelRef, '100px', (intersecting) => {
		if (!enableLoadNext) return
		if (!intersecting) return
		if (songs.length > 0 && nextExists) {
			setNextLoading(true)
			loadNext()
		}
	})
	useChangeDelayer(
		normalizeSearchText(searchString),
		(value) => {
			loadPage(0, true).then(() => {
				setEnableLoadNext(true)
			})
		},
		[]
	)

	return (
		<ContainerGrid direction="column">
			<>
				<Typography strong>Výsledky vyhledávání:</Typography>

				{!loading && songs.length > 0 && (
					<SongListCards
						data={songs}
						key={'songlistcards'}
						properties={[
							'SHOW_ADDED_BY_LOADER',
							'SHOW_PRIVATE_LABEL',
							// 'SHOW_YOUR_PUBLIC_LABEL',
						]}
					></SongListCards>
				)}
			</>

			<div ref={loadNextLevelRef}></div>

			{loading && (
				<>
					<LinearProgress sx={{ color: grey[500] }} color={'inherit'} />
				</>
			)}

			<>
				{!loading && songs.length > 0 && nextExists && (
					<>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Button
								loading={nextLoading}
								loadingPosition="start"
								onClick={() => {
									setNextLoading(true)
									loadNext()
								}}
								variant="text"
								startIcon={<Sync />}
							>
								Načíst další
							</Button>
						</Box>
					</>
				)}
			</>

			{!loading && songs.length < 1 && (
				<>
					<Typography>Nic jsme nenašli...</Typography>
				</>
			)}

			<Gap />
		</ContainerGrid>
	)
})

export default SearchedSongsList
