'use client'
import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { Box, Typography } from '@/common/ui'
import { BarChart } from '@mui/x-charts'
import { useMemo } from 'react'

type DataItem = {
	songTitle: string
	playedCount: number
}

type MostPlayedSongsEverCardProps = {
	data: GetTeamStatisticsOutDto['topPlayedSongs']
}

export default function MostPlayedSongsEverCard(
	props: MostPlayedSongsEverCardProps
) {
	const dataset: DataItem[] = useMemo(() => {
		return props.data
			.map((item) => {
				// Make title from multiple songs title, max three, separated by comma, then add and x more if there are more songs
				return item.songs.map((song) => ({
					songTitle: song.title,
					playedCount: item.playedCount,
				}))
			})
			.flat()
			.slice(0, 10)
	}, [props.data])

	return (
		<TeamCard>
			<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
				<Typography variant="h6" strong>
					10 Nejhranějších písní
				</Typography>
				<Typography>Za celou dobu</Typography>
			</Box>
			<BarChart
				dataset={dataset}
				yAxis={[{ scaleType: 'band', dataKey: 'songTitle' }]}
				series={[
					{
						dataKey: 'playedCount',
						// label: 'Počet přehrání',
						valueFormatter: (v) => v + ' přehrání',
					},
				]}
				layout="horizontal"
				// {...chartSetting}
				height={400}
				margin={{
					left: 150,
				}}
			/>
		</TeamCard>
	)
}
