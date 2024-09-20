'use client'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { PageProps } from '@/common/types'
import { Typography } from '@/common/ui/Typography'
import { WavingHand } from '@mui/icons-material'
import { Box, Grid } from '@mui/material'

export default function TeamPage(props: PageProps<'team'>) {
	const { name } = useInnerTeam()
	return (
		<>
			<TeamPageTitle>Přehled</TeamPageTitle>
			<Grid container spacing={2} padding={2}>
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
				{/* <Grid item sm={12} md={6} lg={4}></Grid> */}
			</Grid>
		</>
	)
}
