'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import EverySongPlayedCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/EverySongPlayedCard'
import LeastPlayedSongsEverCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/LeastPlayedSongsEverCard'
import MostFavouritesSongsCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/MostFavouritesSongsCard'
import MostPlayedSongsEverCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/MostPlayedSongsEverCard'
import MostTrendSong from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/MostTrendSong'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Box, LinearProgress } from '@/common/ui'
import { Grid } from '@/common/ui/mui/Grid'
import { useApiStateEffect } from '@/tech/ApiState'
export default SmartTeamPage(TeamStatistikyPage)

function TeamStatistikyPage() {
	const { teamStatisticsApi } = useApi()
	const { guid: teamGuid } = useInnerTeam()
	const [{ data: statisticsData, loading: statisticsLoading }] =
		useApiStateEffect(async () => {
			if (!teamGuid) return null
			return teamStatisticsApi.getTeamStatistics(teamGuid)
		}, [teamGuid])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
			}}
		>
			<TeamPageTitle>Statistiky</TeamPageTitle>

			{statisticsLoading && <LinearProgress />}

			{statisticsData && (
				<Grid container spacing={2}>
					<Grid item xs={12} md={8}>
						<MostPlayedSongsEverCard data={statisticsData.topPlayedSongs} />
					</Grid>
					<Grid item xs={12} md={4}>
						<Box display={'flex'} flexDirection={'column'} gap={2}>
							<MostFavouritesSongsCard
								data={statisticsData.mostFavouriteSongs}
							/>
							<EverySongPlayedCard data={statisticsData.playedCountSongs} />
						</Box>
					</Grid>
					<Grid item xs={12} md={6}>
						<MostTrendSong data={statisticsData.mostTrendingSongs} />
					</Grid>
					<Grid item xs={12} md={6}>
						<LeastPlayedSongsEverCard data={statisticsData.leastPlayedSongs} />
					</Grid>
				</Grid>
			)}
		</Box>
	)
}
