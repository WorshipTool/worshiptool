import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { Box, Typography, useTheme } from '@/common/ui'
import { BarChart } from '@mui/x-charts'
import { useMemo } from 'react'

type DataItem = {
	songTitle: string
	trend: number
}

type MostTrendSongProps = {
	data: GetTeamStatisticsOutDto['mostTrendingSongs']
}

export default function MostTrendSong(props: MostTrendSongProps) {
	const dataset: DataItem[] = useMemo(() => {
		return props.data
			.map((item) => {
				// Make title from multiple songs title, max three, separated by comma, then add and x more if there are more songs
				const title = item.song.title
				return {
					songTitle: title,
					trend: title == 'Ovečka kudrnatá' ? -30 : item.trending,
				}
			})
			.sort((a, b) => b.trend - a.trend)
	}, [props.data])

	const theme = useTheme()
	return (
		<TeamCard>
			<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
				<Typography variant="h6" strong>
					5 Trendy písní
				</Typography>
				<Typography>V rámci 20 dnů</Typography>
			</Box>
			<BarChart
				dataset={dataset}
				yAxis={[
					{
						dataKey: 'trend',
						colorMap: {
							type: 'piecewise',
							thresholds: [-100, -50, 0, 50, 100],
							colors: [
								theme.palette.error.main,
								theme.palette.error.light,
								theme.palette.error.light,
								theme.palette.primary.light,
								theme.palette.primary.main,
							],
						},
					},
				]}
				xAxis={[
					{
						// data: ['a', 'b', 'c', 'd', 'e'],
						dataKey: 'songTitle',
						scaleType: 'band',
					},
				]}
				series={[
					{
						dataKey: 'trend',
						// label: 'Počet přehrání',
						valueFormatter: (v) => v + '%',
					},
				]}
				layout="vertical"
				// {...chartSetting}
				height={400}
			/>
		</TeamCard>
	)
}
