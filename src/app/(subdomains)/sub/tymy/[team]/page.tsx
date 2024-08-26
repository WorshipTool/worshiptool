'use client'
import TeamCard from '@/app/(subdomains)/sub/tymy/[team]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[team]/components/TopPanel/components/TeamPageTitle'
import { PageProps } from '@/common/types'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'
import { Grid } from '@mui/material'

export default function TeamPage(props: PageProps<'team'>) {
	const pathname = useClientPathname()
	return (
		<div>
			<TeamPageTitle>Přehled</TeamPageTitle>

			<Grid container spacing={2}>
				<Grid item sm={12} md={6} lg={4}>
					<TeamCard title="Nejbližší akce">
						ahojj {props.params.team} {pathname}
					</TeamCard>
				</Grid>
				<Grid item sm={12} md={6} lg={4}>
					<TeamCard title="Připnuté">
						ahojj {props.params.team} {pathname}
					</TeamCard>
				</Grid>
			</Grid>
		</div>
	)
}
