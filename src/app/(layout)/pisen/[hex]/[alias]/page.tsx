'use client'
import { Typography } from '@/common/ui/Typography'
import { useEffect, useState } from 'react'
import {
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
	SongDto,
	SongVariantDto,
} from '../../../../../api/dtos'
import { SongGettingApi } from '../../../../../api/generated'
import { SmartParams } from '../../../../../routes'
import { handleApiCall } from '../../../../../tech/handleApiCall'
import NotFound from './not-found'
import SongContainer from './SongContainer'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

type SongRoutePageProps = {
	params: SmartParams<'variant'>
}

export default function SongRoutePage({ params }: SongRoutePageProps) {
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
			<>
				{song && variantData ? (
					<SongContainer variant={variantData} song={song} />
				) : (
					<>
						<Typography>Načítání...</Typography>
					</>
				)}
			</>
		)
	} catch (e) {
		return <NotFound />
	}
}
