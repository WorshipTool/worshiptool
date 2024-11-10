'use client'
import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamStatisticsCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/TeamStatisticsCard'
import { getStatisticsColorFromString } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/tech/statistics.tech'
import { useTheme } from '@/common/ui'
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

	const theme = useTheme()

	return (
		<TeamStatisticsCard
			label="10 nejhranějších chval"
			rightLabel="Za posledních 90 dní"
		>
			<BarChart
				dataset={dataset}
				yAxis={[
					{
						scaleType: 'band',
						dataKey: 'songTitle',
						colorMap: {
							// type: 'piecewise',
							// thresholds: [0],
							// colors: [theme.palette.primary.light],
							type: 'ordinal',
							colors: dataset.map((item) => {
								return getStatisticsColorFromString(item.songTitle)
							}),
						},
					},
				]}
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
		</TeamStatisticsCard>
	)
}
