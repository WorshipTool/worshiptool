'use client'
import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import BarChartRow from '@/app/(submodules)/(teams)/sub/tymy/[alias]/statistiky/components/BarChartRow'
import { Box, Gap, Typography } from '@/common/ui'
import { useMemo } from 'react'

type DataItem = {
	songTitle: string
	playedCount: number
}

type EverySongPlayedCardProps = {
	data: GetTeamStatisticsOutDto['playedCountSongs']
}

export default function EverySongPlayedCard(props: EverySongPlayedCardProps) {
	const dataset: DataItem[] = useMemo(() => {
		return props.data.map((item) => {
			return {
				songTitle: item.song.title,
				playedCount: item.playedCount,
			}
		})
	}, [props.data])

	const maxValue = Math.max(...dataset.map((item) => item.playedCount))

	return (
		<TeamCard>
			<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
				<Typography variant="h6" strong>
					Kolikrát se co hrálo
				</Typography>
				<Typography>Za celou dobu</Typography>
			</Box>
			{/* <BarChart
				dataset={dataset}
				yAxis={[
					{
						scaleType: 'band',
						dataKey: 'songTitle',
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
					left: leftMargin,
				}}
			/> */}

			<Gap />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 0.5,
					overflowY: 'auto',
					maxHeight: 400,
					paddingRight: 1,
				}}
			>
				{dataset.map((item, index) => (
					<BarChartRow
						key={index}
						label={item.songTitle}
						value={item.playedCount}
						maxValue={maxValue}
						tooltip={`Hrálo se ${item.playedCount} krát`}
					/>
				))}
			</Box>
		</TeamCard>
	)
}
