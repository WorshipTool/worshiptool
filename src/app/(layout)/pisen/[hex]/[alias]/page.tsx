'use client'
import DragCorner from '@/app/(layout)/pisen/[hex]/[alias]/components/DragCorner'
import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import ContainerGrid from '@/common/components/ContainerGrid'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Typography } from '@/common/ui/Typography'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { Box } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
	SongDto,
	SongVariantDto,
	VariantPackAlias,
	VariantPackGuid,
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
} from '../../../../../api/dtos'
import { SongGettingApi } from '../../../../../api/generated'
import { SmartParams } from '../../../../../routes'
import { handleApiCall } from '../../../../../tech/handleApiCall'
import SongContainer from './SongContainer'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

type SongRoutePageProps = {
	params: SmartParams<'variant'>
}

export default SmartPage(SongRoutePage)

function SongRoutePage({ params }: SongRoutePageProps) {
	const alias = useMemo(() => {
		return getVariantAliasFromParams(params.hex, params.alias)
	}, [params.hex, params.alias])

	const [song, setSong] = useState<SongDto>()
	const [variantData, setVariantData] = useState<SongVariantDto>()
	useEffect(() => {
		const doFetchStuff = async () => {
			const v = await getVariantByAlias(alias)
			const variant = v.variants[0]

			const songGettingApi = new SongGettingApi()

			const data = await handleApiCall(
				songGettingApi.songGettingControllerGetSongDataByVariantGuid(
					variant.guid
				)
			)

			const song = mapGetSongDataApiToSongDto(data)
			const variantData = mapSongDataVariantApiToSongVariantDto(variant)

			setSong(song)
			setVariantData(variantData)
		}
		doFetchStuff()
	}, [alias])
	return (
		<InnerSongProvider variantAlias={alias}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					position: 'relative',
				}}
			>
				<ContainerGrid
					sx={{
						marginTop: 2,
						marginBottom: 2,
						padding: 3,
						backgroundColor: 'grey.200',
						borderStyle: 'solid',
						borderWidth: 1,
						borderColor: 'grey.400',
						borderRadius: 1,
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						displayPrint: 'none',
						position: 'relative',
					}}
				>
					{Array.from({ length: 4 }).map((_, i) => (
						<DraggableSong
							key={i}
							data={{
								packGuid: variantData?.packGuid || ('' as VariantPackGuid),
								title: variantData?.preferredTitle || '',
								alias: variantData?.packAlias || ('' as VariantPackAlias),
							}}
						>
							<DragCorner index={i} />
						</DraggableSong>
					))}
					{song && variantData ? (
						<SongContainer variant={variantData} song={song} />
					) : (
						<>
							<Typography>Načítání...</Typography>
						</>
					)}
				</ContainerGrid>
			</Box>
		</InnerSongProvider>
	)
}
