'use client'
import ContainerGrid from '@/common/components/ContainerGrid'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import {
	SongDto,
	SongVariantDto,
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
} from '../../../../../api/dtos'
import { SongGettingApi } from '../../../../../api/generated'
import { SmartParams } from '../../../../../routes'
import { handleApiCall } from '../../../../../tech/handleApiCall'
import SongContainer from './SongContainer'
import NotFound from './not-found'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

type SongRoutePageProps = {
	params: SmartParams<'variant'>
}

export default SmartPage(SongRoutePage)

function SongRoutePage({ params }: SongRoutePageProps) {
	const [song, setSong] = useState<SongDto>()
	const [variantData, setVariantData] = useState<SongVariantDto>()
	useEffect(() => {
		const doFetchStuff = async () => {
			const alias = getVariantAliasFromParams(params.hex, params.alias)
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
	}, [params.hex, params.alias])
	try {
		//TODO: Sometime not working when group is turned on

		return (
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
					}}
				>
					{song && variantData ? (
						<SongContainer variant={variantData} song={song} />
					) : (
						<>
							<Typography>Načítání...</Typography>
						</>
					)}
				</ContainerGrid>
			</Box>
		)
	} catch (e) {
		return <NotFound />
	}
}
