import { Box, Button, Typography } from '@/common/ui'
import { TextField } from '@/common/ui/mui'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { PushPin } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { Card } from '../../../../../../../common/ui/Card/Card'
import { Gap } from '../../../../../../../common/ui/Gap'
import useGroup from '../../../../../../../hooks/group/useGroup'
import { routesPaths } from '../../../../../../../routes'
import { getParamsFromUrl } from '../../../../../../../routes/useSmartParams'
import PinnedPlaylist from './PinnedPlaylist'

export default function PinPlaylistPanel() {
	const { payload, setPayload } = useGroup()

	const [pinnedPlaylist, setPinnedPlaylist] =
		React.useState<PlaylistGuid | null>(payload.pinnedPlaylist || null)

	useEffect(() => {
		setPinnedPlaylist(payload.pinnedPlaylist || null)
	}, [payload.pinnedPlaylist])

	const [choosing, setChoosing] = React.useState(false)

	const [value, setValue] = useState('')
	const [error, setError] = useState<string | null>(null)

	const [loading, setLoading] = useState(false)

	const onPinClick = () => {
		// setChoosing(false);
		const params = getParamsFromUrl(value, routesPaths.playlist)
		const playlistGuid = params.guid as PlaylistGuid | null

		if (!playlistGuid) {
			setError('Neplatná url playlistu.')
			return
		}
		setError(null)
		setLoading(true)
		setPayload({
			pinnedPlaylist: playlistGuid,
		})
			.then(() => {
				setPinnedPlaylist(playlistGuid)
			})
			.finally(() => {
				setChoosing(false)
				setLoading(false)
			})
	}

	const onTryAgain = () => {
		setPinnedPlaylist(null)
		setValue('')
		setChoosing(true)
		setError(null)
	}

	const onRemoveClick = () => {
		setLoading(true)
		setPayload({
			pinnedPlaylist: null,
		}).then(() => {
			setPinnedPlaylist(null)
			setValue('')
			setLoading(false)
			setError(null)
		})
	}

	return (
		<Card
			title="Připnout playlist"
			icon={<PushPin />}
			sx={{
				position: 'relative',
			}}
		>
			<Box>
				{pinnedPlaylist ? (
					<>
						<PinnedPlaylist
							guid={pinnedPlaylist}
							onRemove={onRemoveClick}
							onTryAgain={onTryAgain}
							loading={loading}
						/>
					</>
				) : (
					<Box
						display={'flex'}
						sx={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 1,
						}}
					>
						{!choosing ? (
							<>
								<Typography>Zatím nemáte připnutý žádný playlist.</Typography>
								<Button
									loading={loading}
									size="small"
									variant="contained"
									onClick={() => setChoosing(true)}
								>
									Zvolit playlist
								</Button>
							</>
						) : (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'start',
									justifyContent: 'space-between',
								}}
								flex={1}
							>
								<Typography>
									Zadejte, prosím, url playlistu, který chcete připnout.
								</Typography>
								<Gap />
								<Box display={'flex'} gap={1}>
									<TextField
										size="small"
										placeholder="Url playlistu"
										value={value}
										onChange={(e) => setValue(e.target.value)}
										disabled={loading}
										helperText={error}
										error={!!error}
									/>
									<Button onClick={onPinClick} loading={loading}>
										Připnout
									</Button>
								</Box>
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Card>
	)
}
