'use client'
import {
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
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

export default async function SongRoutePage({ params }: SongRoutePageProps) {
	try {
		const alias = getVariantAliasFromParams(params.hex, params.alias)
		const v = await getVariantByAlias(alias)
		const variant = v.variants[0]

		const songGettingApi = new SongGettingApi()

		const data = await handleApiCall(
			songGettingApi.songGettingControllerGetSongDataByVariantGuid(variant.guid)
		)

		const song = mapGetSongDataApiToSongDto(data)
		const variantData = mapSongDataVariantApiToSongVariantDto(variant)
		//TODO: Sometime not working when group is turned on

		return (
			<>
				<SongContainer variant={variantData} song={song} />
			</>
		)
	} catch (e) {
		return <NotFound />
	}
}
