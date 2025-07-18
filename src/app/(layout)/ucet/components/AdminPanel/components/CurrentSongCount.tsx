import { IconButton, Tooltip } from '@/common/ui'
import { AutoMode, FiberManualRecord, Numbers } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useApi } from '../../../../../../api/tech-and-hooks/useApi'
import { Card } from '../../../../../../common/ui/Card/Card'

export default function CurrentSongCount() {
	const { songGettingApi } = useApi()
	const [songCount, setSongCount] = useState<number>()

	const [autoRefresh, setAutoRefresh] = useState<boolean>(false)

	const getCount = async (ignore: boolean = false) => {
		if (ignore || autoRefresh) {
			songGettingApi
				.getSongsCount()
				.then((r) => {
					setSongCount(r)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	useEffect(() => {
		getCount(true)
		const interval = setInterval(getCount, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [autoRefresh])
	return (
		<Card
			title="Aktuální počet písní"
			subtitle={songCount?.toString() ?? 'Načítání...'}
			icon={
				<>
					<Numbers />
					<IconButton
						sx={{
							position: 'absolute',
							top: 15,
							right: 15,
						}}
						onClick={() => setAutoRefresh((a) => !a)}
					>
						{autoRefresh ? (
							<Tooltip title={'Auto-refresh je zapnutý'}>
								<AutoMode color="primary" />
							</Tooltip>
						) : (
							<FiberManualRecord />
						)}
					</IconButton>
				</>
			}
			sx={{
				position: 'relative',
			}}
		></Card>
	)
}
