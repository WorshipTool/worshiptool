import { AutoMode, FiberManualRecord, Numbers } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import Card from '../../../../../common/ui/Card/Card'
import { useApi } from '../../../../../hooks/api/useApi'
import { handleApiCall } from '../../../../../tech/handleApiCall'

export default function CurrentSongCount() {
	const { songGettingApi } = useApi()
	const [songCount, setSongCount] = useState<number>()

	const [autoRefresh, setAutoRefresh] = useState<boolean>(false)

	const getCount = async (ignore: boolean = false) => {
		if (ignore || autoRefresh) {
			handleApiCall(songGettingApi.songGettingControllerGetSongsCount())
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
