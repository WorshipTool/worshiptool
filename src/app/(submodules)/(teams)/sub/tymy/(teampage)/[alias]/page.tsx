'use client'
import NextPlannedPlaylistPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/NextPlannedPlaylistPanel/NextPlannedPlaylistPanel'
import TeamQuickActions from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamQuickActions'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { PageProps } from '@/common/types'
import { Box, useTheme } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'
import { Grid } from '@/common/ui/mui/Grid'
import { Typography } from '@/common/ui/Typography'
import { WavingHand } from '@mui/icons-material'

export default SmartTeamPage(TeamPage, {
	collapseSideBar: false,
})

function TeamPage(props: PageProps<'team'>) {
	const { name } = useInnerTeam()
	const theme = useTheme()
	return (
		<>
			<TeamPageTitle>Přehled</TeamPageTitle>
			<Grid container spacing={2}>
				<Grid item xs={12} display={'flex'}>
					<TeamCard>
						<Box
							display={'flex'}
							flexDirection={'row'}
							alignItems={'center'}
							gap={2}
						>
							<WavingHand />
							<Box>
								<Typography variant="h6" strong>
									Vítejte na domovské stránce týmu <i>{name}</i>
								</Typography>
								Ať vám aplikace dobře slouží
							</Box>
						</Box>
					</TeamCard>
				</Grid>
				<Grid item xs={12}>
					<Typography strong>Rychlé akce</Typography>
					<Gap />
					<TeamQuickActions />
				</Grid>
				<Grid item>
					<Gap />
					<NextPlannedPlaylistPanel />
				</Grid>
			</Grid>
		</>
	)
}
