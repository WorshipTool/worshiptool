'use client'
import TeamQuickActions from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamQuickActions'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { PageProps } from '@/common/types'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { WavingHand } from '@mui/icons-material'
import { Box, Grid, useTheme } from '@mui/material'

export default SmartTeamPage(TeamPage)

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
				<Grid item>
					<Typography strong>Rychlé akce</Typography>
					<Gap />
					<TeamQuickActions />
				</Grid>
				{/* <Grid item sm={12} md={6} lg={4}></Grid> */}
			</Grid>
		</>
	)
}
