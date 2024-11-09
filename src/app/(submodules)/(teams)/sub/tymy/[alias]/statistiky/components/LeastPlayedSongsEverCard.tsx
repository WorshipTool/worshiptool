'use client'
import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { Box, Typography } from '@/common/ui'
import { BarChart } from '@mui/x-charts'
import { useMemo } from 'react'

type DataItem = {
	song: string
	playedCount: number
}

type LeastPlayedSongsEverCardProps = {
	data: GetTeamStatisticsOutDto['leastPlayedSongs']
}

export default function LeastPlayedSongsEverCard(
	props: LeastPlayedSongsEverCardProps
) {
	const dataset: DataItem[] = useMemo(() => {
		return props.data.map((item) => {
			// Make title from multiple songs title, max three, separated by comma, then add and x more if there are more songs
			const title = item.songs
				.slice(0, 2)
				.map((song) => song.title)
				.join(', ')
			const more = item.songs.length - 3
			const moreText = more > 0 ? ` a ${more} další` : ''
			const songTitle = `${title}${moreText}`
			return {
				song: songTitle,
				playedCount: item.playedCount,
			}
		})
	}, [props.data])

	return (
		<TeamCard>
			<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
				<Typography variant="h6" strong>
					10 Nejméně hraných písní
				</Typography>
				<Typography>Za celou dobu</Typography>
			</Box>
			<BarChart
				dataset={dataset}
				yAxis={[{ scaleType: 'band', dataKey: 'song' }]}
				series={[
					{
						dataKey: 'playedCount',
						label: 'Počet přehrání',
						valueFormatter: (v) => v + '',
					},
				]}
				layout="horizontal"
				height={400}
				margin={{
					left: 150,
				}}
			/>
		</TeamCard>
	)
}
