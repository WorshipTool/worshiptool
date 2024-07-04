'use client'
import { Statistics } from '@/api/generated'
import Card from '@/common/ui/Card/Card'
import { Gap } from '@/common/ui/Gap'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { LineChart, lineElementClasses, LineSeriesType } from '@mui/x-charts'
import { useEffect, useState } from 'react'

export default function GetterGraphs() {
	const days = 10
	const { songAddingApi } = useApi()

	const [data, setData] = useState<Statistics>()

	useEffect(() => {
		const doStuff = async () => {
			const data = await handleApiCall(
				songAddingApi.getterAddingControllerGetStatistics(days)
			)
			setData(data)
		}
		doStuff()
	}, [])

	return (
		<Card
			title="Statistika - Getter"
			subtitle="Úspěšně přečtené / Veškeré nalezené (mimo chybně přečtené)"
			style={{
				width: '100%',
			}}
		>
			<LineChart
				xAxis={[
					{
						scaleType: 'time',
						data: Array.from({ length: days }, (_, i) => {
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
						? data.domains.map(
								(domain): LineSeriesType => ({
									data: domain.data.map((d) => d.value),
									label: domain.name,
									valueFormatter: (v: any) => v + '%',
									// showMark: ({ index }) => index % 2 === 0,
									type: 'line',
								})
						  )
						: []),

					// {
					// 	data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
					// },
					// {
					// 	data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
					// },
				]}
				height={300}
				margin={{ top: 10, bottom: 80 }}
			/>
			<Gap />
			{/* <LineChart
				// xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}

				sx={{
					[`& .${lineElementClasses.root}`]: {
						// strokeDasharray: '10 5',
						strokeWidth: 5,
					},
					width: '100%',
					minWidth: 400,
				}}
				series={[
					{
						data: allData,
						label: 'Všechny nalezené',
						valueFormatter: (v: any) => v + '%',
					},
				]}
				height={150}
				margin={{ top: 10, bottom: 20 }}
			/> */}
		</Card>
	)
}
