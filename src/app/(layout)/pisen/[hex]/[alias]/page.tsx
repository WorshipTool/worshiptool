'use server'
import DragCorner from '@/app/(layout)/pisen/[hex]/[alias]/components/DragCorner'
import SongAnalyze from '@/app/(layout)/pisen/[hex]/[alias]/components/SongAnalyze'
import SongContainer from '@/app/(layout)/pisen/[hex]/[alias]/SongContainer'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import ContainerGrid from '@/common/components/ContainerGrid'
import { checkFlag } from '@/common/providers/FeatureFlags/flags.tech'
import { Box } from '@/common/ui'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { VariantPackAlias } from '@/types/song'
import {
	VariantPackGuid,
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
} from '../../../../../api/dtos'
import { SmartParams } from '../../../../../routes'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

type SongRoutePageProps = {
	params: SmartParams<'variant'>
}

export default SmartPage(SongRoutePage)

async function SongRoutePage({ params }: SongRoutePageProps) {
	const alias = getVariantAliasFromParams(params.hex, params.alias)

	const v = await getVariantByAlias(alias)
	const mainPack = v.main

	const song = mapGetVariantDataApiToSongDto(v)
	const variantData = mapExtendedVariantPackApiToDto(mainPack)

	const showMedia = await checkFlag('show_media_on_song_page')
	return (
		<Box
			sx={{
				display: 'flex',
				// flexDirection: 'row',
				position: 'relative',
			}}
		>
			{/* Just a client analytics */}
			<SongAnalyze data={variantData} />

			<ContainerGrid
				sx={{
					marginTop: 2,
					marginBottom: 2,
					gap: 2,
					alignItems: 'start',
				}}
			>
				<Box
					sx={{
						padding: 3,
						backgroundColor: 'grey.200',
						borderStyle: 'solid',
						borderWidth: 1,
						borderColor: 'grey.300',
						boxShadow: '0px 2px 3px 1px rgba(0, 0, 0, 0.1)',
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

					<SongContainer
						variant={variantData}
						song={song}
						flags={{
							showMedia: showMedia,
						}}
					/>
				</Box>

				{/* <SongRightPanel /> */}
			</ContainerGrid>
		</Box>
	)
}
