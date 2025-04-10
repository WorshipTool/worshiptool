'use client'
import { mapExtendedVariantPackApiToDto } from '@/api/dtos'
import { getVariantAliasFromParams } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import { MORE_TEAM_SONG_BUTTON_ID } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/pisen/[hex]/[title-alias]/components/MoreTeamSongButton'
import SongPreview from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/pisen/[hex]/[title-alias]/components/SongPreview'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { SmartPortalMenuProvider } from '@/common/components/SmartPortalMenuItem/SmartPortalMenuProvider'
import { Box, IconButton, LinearProgress } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { SmartParams } from '@/routes'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { AudioFile, KeyboardArrowLeft, OpenInNew } from '@mui/icons-material'
import { useMemo } from 'react'

type TeamPisenPageProps = {
	params: SmartParams<'teamSong'>
}

export default SmartTeamPage(TeamPisenPage)
export function TeamPisenPage(props: TeamPisenPageProps) {
	const { selection } = useInnerTeam()
	const { songGettingApi } = useApi()

	const [apiState] = useApiStateEffect(async () => {
		const alias = getVariantAliasFromParams(
			props.params.hex,
			props.params['title-alias']
		)
		const v = await handleApiCall(
			songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)
		)

		const d = mapExtendedVariantPackApiToDto(v.main)

		return d
	}, [props.params.hex, props.params['title-alias']])

	const isInSelection = useMemo(() => {
		return (
			selection.items.find(
				(i) => i.pack.packGuid === apiState.data?.packGuid
			) !== undefined && apiState.data !== undefined
		)
	}, [apiState.data, selection])

	return (
		<Box>
			<TeamPageTitle>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={2}
				>
					<IconButton
						sx={{
							transform: 'translateX(-10px)',
						}}
						color="grey.900"
						onClick={() => {
							window.history.back()
						}}
					>
						<KeyboardArrowLeft />
					</IconButton>
					<Box
						display={'flex'}
						justifyContent={'end'}
						alignItems={'center'}
						width={1 * 8}
						sx={{
							transform: 'translateX(-8px)',
						}}
					>
						<AudioFile
							fontSize="inherit"
							sx={{
								fontSize: '1.8rem',
							}}
						/>
					</Box>
					{apiState.data?.title}
				</Box>
			</TeamPageTitle>
			{apiState.loading || !apiState.data ? (
				<Box>
					<LinearProgress />
				</Box>
			) : isInSelection ? (
				apiState.data && (
					<SmartPortalMenuProvider id={MORE_TEAM_SONG_BUTTON_ID}>
						<SongPreview variant={apiState.data} />
					</SmartPortalMenuProvider>
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
