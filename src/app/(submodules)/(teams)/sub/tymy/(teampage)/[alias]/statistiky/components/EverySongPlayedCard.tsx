'use client'
import { GetTeamStatisticsOutDto } from '@/api/generated'
import BarChartRow from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/BarChartRow'
import TeamStatisticsCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/TeamStatisticsCard'
import { Box, Gap } from '@/common/ui'
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
		<TeamStatisticsCard label="Kolikrát se co hrálo" rightLabel="Za celou dobu">
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
					paddingRight: 1,
					maxHeight: 173,
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
		</TeamStatisticsCard>
	)
}
