'use client'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { Typography } from '@/common/ui/Typography'
import { Sheet } from '@pepavlin/sheet-api'
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

			const s = new Sheet(variant.sheetData)

			Analytics.track('VISIT_SONG', {
				songGuid: song.guid,
				variantGuid: variant.guid,
				title: song.title,
				hasChords: s.getKeyNote() !== null,
			})
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
