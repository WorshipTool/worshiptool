'use client'
import { GetAnalyticsOutDto } from '@/api/generated'
import Card from '@/common/ui/Card/Card'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { LineChart, LineSeriesType, lineElementClasses } from '@mui/x-charts'
import { useEffect, useState } from 'react'

export default function GetterGraphs() {
	const { analyticsApi } = useApi()

	const [data, setData] = useState<GetAnalyticsOutDto>()

	const targetDaysCount = 5

	useEffect(() => {
		const doStuff = async () => {
			const data = await handleApiCall(
				analyticsApi.analyticsControllerGetAnalytics(targetDaysCount)
			)
			setData(data)
		}
		doStuff()
	}, [])

	return (
		<>
			{data && (
				<>
					<Card title={'Statistika'} />
					{data.graphs.map((graph, index) => (
						<Card
							key={index}
							subtitle={`Statistika za posledních ${targetDaysCount} dní`}
							title={graph.title}
							style={{
								width: '100%',
							}}
							icon={<></>}
						>
							<LineChart
								xAxis={[
									{
										scaleType: 'time',
										data: Array.from({ length: data.days }, (_, i) => {
											const d = new Date()
											d.setDate(d.getDate() - i)
											return d
										}),
									},
								]}
								sx={{
									[`& .${lineElementClasses.root}`]: {
										strokeDasharray: '10 5',
										strokeWidth: 2,
									},
									width: '100%',
									minWidth: 400,
								}}
								slotProps={{
									legend: {
										direction: 'row',
										position: {
											vertical: 'bottom',
											horizontal: 'left',
										},
										itemMarkWidth: 20,
										itemMarkHeight: 20,
										markGap: 5,
										itemGap: 10,
									},
								}}
								series={[
									...(data
										? graph.lines.map(
												(line): LineSeriesType => ({
													data: line.values.map((v) => v.value),
													label: line.name,
													type: 'line',
													valueFormatter: (v) =>
														line.values.find((x) => x.value === v)?.string ||
														v?.toString() ||
														'Null',
												})
										  )
										: []),
								]}
								height={200}
								margin={{ top: 10, bottom: 80 }}
							/>
						</Card>
					))}
				</>
			)}
		</>
	)
}
