'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import {
	useInnerPack,
	useInnerPackSong,
} from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import Popup from '@/common/components/Popup/Popup'
import { Box, Button, Gap, TextField } from '@/common/ui'
import { Switch } from '@/common/ui/mui'
import { useApiState } from '@/tech/ApiState'
import { MusicVideo } from '@mui/icons-material'
import { useEffect, useState } from 'react'

type Props = {
	onChange?: () => void
}

export default function AddMediaAdminButton({ onChange }: Props) {
	const [open, setOpen] = useState(false)
	const [url, setUrl] = useState('')

	const [adding, setAdding] = useState(true)

	const { packGuid } = useInnerPack()
	const { song } = useInnerPackSong()
	const { songManagementApi } = useApi()
	const onSubmit = async () => {
		await doFetch(true)
		onChange?.()
	}

	const remove = async () => {
		await doFetch(false)
		onChange?.()
	}

	const { fetchApiState, apiState } = useApiState()

	const doFetch = async (add: boolean) => {
		// 0. Check if the URL is valid
		if (!url) {
			return
		}

		// 1. Add or remove the media
		if (add) {
			await fetchApiState(() =>
				songManagementApi.addMediaToPack({
					packGuid,
					mediaUrl: url,
				})
			)
		} else {
			const a = await fetchApiState(() =>
				songManagementApi.removeMediaFromPack({
					packGuid,
					mediaGuid: url,
				})
			)
		}
		setOpen(false)
		// 2. Reload the page
		// window.location.reload()
	}

	useEffect(() => {
		if (open) {
			setUrl('')
		}
	}, [open])

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				startIcon={<MusicVideo fontSize="small" />}
			>
				Přidat nahrávku
			</Button>

			<Popup
				onClose={() => setOpen(false)}
				onSubmit={onSubmit}
				width={300}
				open={open}
				title={
					<Box
						display={'flex'}
						flexDirection={'row'}
						gap={5}
						alignItems={'center'}
					>
						Přidat nahrávku
						<Gap horizontal />
						{song.media.length > 0 && (
							<Switch checked={adding} onChange={() => setAdding(!adding)} />
						)}
					</Box>
				}
				actions={[
					<Button
						key={'cancel'}
						variant="outlined"
						type="reset"
						loading={apiState.loading}
					>
						Zrušit
					</Button>,
					!adding ? (
						<Button
							key={'remove'}
							variant="contained"
							color="error"
							onClick={remove}
							size="small"
						>
							Odebrat
						</Button>
					) : (
						<Button key={'action'} type={'submit'} loading={apiState.loading}>
							Přidat
						</Button>
					),
				]}
			>
				{adding ? (
					<>
						<TextField
							sx={{
								bgcolor: 'grey.200',
								padding: 1,
								paddingLeft: 2,
								borderRadius: 2,
							}}
							placeholder={'Zadejte url nahrávky'}
							autoFocus
							value={url}
							onChange={(e) => setUrl(e)}
						/>
					</>
				) : (
					<>
						{song.media.map((media, index) => {
							// get domain
							let title = media.url
							let subtitle = undefined
							try {
								const u = new URL(media.url)
								title = u.hostname
								subtitle = u.pathname
							} catch (e) {}

							const chosen = url === media.guid

							if (chosen) title = 'Vybráno'
							return (
								<Button
									key={media.guid}
									onClick={() => setUrl(media.guid)}
									subtitle={subtitle}
									title={title}
									variant={chosen ? 'contained' : 'outlined'}
								></Button>
							)
						})}
					</>
				)}
			</Popup>
		</>
	)
}
