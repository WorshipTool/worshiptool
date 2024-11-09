'use client'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import EverySongPlayedCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/EverySongPlayedCard'
import LeastPlayedSongsEverCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/LeastPlayedSongsEverCard'
import MostPlayedSongsEverCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/MostPlayedSongsEverCard'
import MostTrendSong from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/MostTrendSong'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Box, LinearProgress } from '@/common/ui'
import { Grid } from '@/common/ui/mui/Grid'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
export default SmartTeamPage(TeamStatistikyPage)

function TeamStatistikyPage() {
	const { teamStatisticsApi } = useApi()
	const { guid: teamGuid } = useInnerTeam()
	const [{ data: statisticsData, loading: statisticsLoading }] =
		useApiStateEffect(async () => {
			if (!teamGuid) return null
			return handleApiCall(
				teamStatisticsApi.teamStatisticsControllerGetTeamStatistics(teamGuid)
			)
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
						<MostTrendSong data={statisticsData.mostTrendingSongs} />
					</Grid>
					<Grid item xs={12} md={4}>
						<MostPlayedSongsEverCard data={statisticsData.topPlayedSongs} />
					</Grid>
					<Grid item xs={12} md={4}>
						<EverySongPlayedCard data={statisticsData.playedCountSongs} />
					</Grid>
					<Grid item xs={12} md={8}>
						<LeastPlayedSongsEverCard data={statisticsData.leastPlayedSongs} />
					</Grid>
				</Grid>
			)}
		</Box>
	)
}
