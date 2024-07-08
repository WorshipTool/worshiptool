'use client'
import Card from '@/common/ui/Card/Card'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { LineChart, lineElementClasses } from '@mui/x-charts'
import { useEffect, useState } from 'react'

type RecordData = {
	[key: string]: number | Date
	date: Date
}

type Graph = {
	title: string
	records: RecordData[]
	lineTitles: Record<string, string>
}

export default function GetterGraphs() {
	const { analyticsApi } = useApi()

	const [data, setData] = useState<Graph[]>()

	const targetDaysCount = 5

	useEffect(() => {
		const doStuff = async () => {
			const data = await handleApiCall(
				analyticsApi.analyticsControllerGetAnalytics(targetDaysCount)
			)
			setData(
				data.graphs.map((graph) => {
					const titles: Record<string, string> = {}
					const records: RecordData[] = []

					graph.lines.forEach((line) => {
						line.values.forEach((value) => {
							const title = line.name
							records.push({
								date: new Date(value.date),
								[title]: value.value,
							})

							titles[title] = title
						})
					})
					return {
						title: graph.title,
						records: records.reverse(),
						lineTitles: titles,
					}
				})
			)
		}
		doStuff()
	}, [])

	return (
		<>
			{data && (
				<>
					<Card title={'Statistika'} />
					{data.map((graph, index) => (
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
										dataKey: 'date',
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
								series={Object.keys(graph.lineTitles).map((title) => ({
									dataKey: title,
									label: title,
									connectNulls: true,
									showMark: false,
								}))}
								height={200}
								margin={{ top: 10, bottom: 80 }}
								dataset={graph.records}
							/>
						</Card>
					))}
				</>
			)}
		</>
	)
}
