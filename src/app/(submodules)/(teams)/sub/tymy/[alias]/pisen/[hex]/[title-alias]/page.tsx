'use client'
import { mapSongDataVariantApiToSongVariantDto } from '@/api/dtos'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import SongPreview from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/SongPreview'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Box, LinearProgress } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { SmartParams } from '@/routes'
import { useApiStateEffect } from '@/tech/ApiState'
import { AudioFile, OpenInNew } from '@mui/icons-material'
import { useMemo } from 'react'

type TeamPisenPageProps = {
	params: SmartParams<'teamSong'>
}

export default SmartTeamPage(TeamPisenPage)
function TeamPisenPage(props: TeamPisenPageProps) {
	// const {} = useSmartParams

	const { selection } = useInnerTeam()

	const [apiState] = useApiStateEffect(async () => {
		const alias = getVariantAliasFromParams(
			props.params.hex,
			props.params['title-alias']
		)
		const v = await getVariantByAlias(alias)
		const variant = v.variants[0]
		const d = mapSongDataVariantApiToSongVariantDto(variant)

		return d
	}, [props.params.hex, props.params['title-alias']])

	const isInSelection = useMemo(() => {
		return (
			selection.items.find(
				(i) => i.variant.packGuid === apiState.data?.packGuid
			) !== undefined && apiState.data !== undefined
		)
	}, [apiState.data, selection])

	return (
		<Box>
			<TeamPageTitle>
				{/* <TransposePanel
					transpose={(i) => {
						sheet?.transpose(i)
						rerender()
					}}
					disabled={false}
				/> */}
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={2}
				>
					<Box
						display={'flex'}
						justifyContent={'end'}
						alignItems={'center'}
						width={6 * 8}
					>
						<AudioFile
							fontSize="inherit"
							sx={{
								fontSize: '1.8rem',
							}}
						/>
					</Box>
					{apiState.data?.preferredTitle}
				</Box>
			</TeamPageTitle>
			{apiState.loading || !apiState.data ? (
				<Box>
					<LinearProgress />
				</Box>
			) : isInSelection ? (
				apiState.data && (
					<>
						<SongPreview variant={apiState.data} />
					</>
				)
			) : (
				<Box>
					<Typography>
						Píseň není v týmovém zpěvníku, ale stále jí můžete zobrazit mimo váš
						tým.
					</Typography>
					<Gap />
					<Box display={'flex'}>
						<Button
							size="small"
							variant="contained"
							endIcon={<OpenInNew />}
							to="variant"
							toParams={{
								alias: props.params['title-alias'],
								hex: props.params.hex,
							}}
							target="_blank"
						>
							Otevřít mimo tým
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	)
}
