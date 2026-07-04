import SongAnalyze from '@/app/(layout)/pisen/[hex]/[alias]/components/SongAnalyze'
import SongContainer from '@/app/(layout)/pisen/[hex]/[alias]/SongContainer'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import ContainerGrid from '@/common/components/ContainerGrid'
import { checkFlag } from '@/common/providers/FeatureFlags/flags.tech'
import { Box } from '@/common/ui'
import {
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
				justifyContent: 'center',
				width: '100%',
				position: 'relative',
			}}
		>
			{/* Just a client analytics */}
			<SongAnalyze data={variantData} />

			<ContainerGrid
				sx={{
					width: '100%',
					marginTop: 3,
					marginBottom: 6,
					paddingX: { xs: 2, md: 3 },
					alignItems: 'start',
				}}
			>
				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<SongContainer
						variant={variantData}
						song={song}
						flags={{
							showMedia: showMedia,
						}}
					/>
				</Box>
			</ContainerGrid>
		</Box>
	)
}
