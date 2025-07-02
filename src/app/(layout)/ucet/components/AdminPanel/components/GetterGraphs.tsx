'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { Card } from '@/common/ui/Card/Card'
import { Typography } from '@/common/ui/Typography'
import { LineChart } from '@mui/x-charts'
import { useEffect, useMemo, useState } from 'react'

type RecordData = {
	[key: string]: number | Date | undefined
	date: Date
}

type Graph = {
	title: string
	subtitle?: string
	records: RecordData[]
	lineTitles: Record<string, string>
}

export default function GetterGraphs() {
	const { analyticsApi } = useApi()

	const [data, setData] = useState<Graph[]>()

	const targetDaysCount = 5

	const minDate = useMemo(() => {
		const d = new Date()
		d.setDate(d.getDate() - targetDaysCount)
		return d
	}, [targetDaysCount])

	useEffect(() => {
		const doStuff = async () => {
			const data = await analyticsApi.getAnalytics(targetDaysCount)
			const arr = data.graphs.map((graph) => {
				const titles: Record<string, string> = {}
				const records: Record<string, RecordData> = {}

				graph.lines.forEach((line) => {
					line.values.forEach((value) => {
						const title = line.name
						const d = new Date(value.date)
						d.setSeconds(0)
						d.setMilliseconds(0)
						const dstring = d.toISOString()

						if (!records[dstring]) records[dstring] = { date: d }

						records[dstring][title] = value.value

						titles[title] = title
					})
				})
				return {
					title: graph.title,
					subtitle: graph.subtitle,
					records: Object.values(records).sort((a, b) => {
						if (a.date < b.date) return -1
						if (a.date > b.date) return 1
						return 0
					}),
					lineTitles: titles,
				}
			})

			setData(arr)
		}
		doStuff()
	}, [])

	return (
		<>
			{data && (
				<>
					<Card>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: 10,
							}}
						>
							<Typography variant="h5">Statistika</Typography>
							<Typography>Za posledních {targetDaysCount} dní</Typography>
						</div>
					</Card>
					{data.map((graph, index) => (
						<Card
							key={index}
							subtitle={graph.subtitle || 'Statistika'}
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
										min: minDate,
										max: new Date(),
									},
								]}
								sx={{
									// [`& .${lineElementClasses.root}`]: {
									// 	strokeDasharray: '10 5',
									// 	strokeWidth: 2,
									// },
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
