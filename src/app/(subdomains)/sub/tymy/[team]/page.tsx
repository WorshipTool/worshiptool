'use client'
import TeamCard from '@/app/(subdomains)/sub/tymy/[team]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[team]/components/TopPanel/components/TeamPageTitle'
import { PageProps } from '@/common/types'
import { Typography } from '@/common/ui/Typography'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { WavingHand } from '@mui/icons-material'
import { Box, Grid } from '@mui/material'

export default function TeamPage(props: PageProps<'team'>) {
	const pathname = useClientPathname()
	return (
		<div>
			<TeamPageTitle>Přehled</TeamPageTitle>

			<Grid container spacing={2}>
				<Grid item sm={12} md={6} lg={4}>
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
									Vítejte na domovské stránce týmu
								</Typography>
								Ať vám aplikace dobře slouží
							</Box>
						</Box>
					</TeamCard>
				</Grid>
			</Grid>
		</div>
	)
}
