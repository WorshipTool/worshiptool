'use client'
import DragCorner from '@/app/(layout)/pisen/[hex]/[alias]/components/DragCorner'
import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import ContainerGrid from '@/common/components/ContainerGrid'
import { Box } from '@/common/ui'
import { Typography } from '@/common/ui/Typography'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { ExtendedVariantPack } from '@/types/song'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect, useMemo, useState } from 'react'
import {
	SongDto,
	VariantPackAlias,
	VariantPackGuid,
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
} from '../../../../../api/dtos'
import { SmartParams } from '../../../../../routes'
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
	const [variantData, setVariantData] = useState<ExtendedVariantPack>()
	useEffect(() => {
		const doFetchStuff = async () => {
			const v = await getVariantByAlias(alias)
			const mainPack = v.main

			const song = mapGetVariantDataApiToSongDto(v)
			const variantData = mapExtendedVariantPackApiToDto(mainPack)

			setSong(song)
			setVariantData(variantData)

			const s = new Sheet(mainPack.sheetData)

			Analytics.track('VISIT_SONG', {
				songGuid: song.guid,
				packGuid: mainPack.packGuid as VariantPackGuid,
				title: song.title,
				hasChords: s.getKeyNote() !== null,
			})
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
								title: variantData?.title || '',
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
