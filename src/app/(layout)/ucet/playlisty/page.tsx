'use client'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { Add, Remove } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	Paper,
	Typography,
	styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Dialog from '../../../../common/ui/Dialog/Dialog'
import { Gap } from '../../../../common/ui/Gap'
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist'
import usePlaylistsGeneral from '../../../../hooks/playlist/usePlaylistsGeneral'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useApiStateEffect } from '../../../../tech/ApiState'

const StyledContainer = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	padding: '0.5rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
	},
	cursor: 'pointer',
}))

export default function Playlists() {
	const {
		getPlaylistsOfUser,
		createPlaylist: createWithoutName,
		deletePlaylist: deleteByGuid,
	} = usePlaylistsGeneral()
	const [loaded, setLoaded] = useState(false)
	const navigate = useSmartNavigate()

	const [createLoading, setCreateLoading] = useState(false)

	const [{ data: playlists, loading, error }, reload] =
		useApiStateEffect(() => {
			return getPlaylistsOfUser().then((r) => {
				return r.playlists
			})
		}, [])

	const [openDialog, setOpenDialog] = useState(false)
	const [deletingTitle, setDeletingTitle] = useState('')
	const [deletingGuid, setDeletingGuid] = useState<PlaylistGuid | null>()

	useEffect(() => {
		if (loaded) return
		if (!loading) setLoaded(true)
	}, [loading])

	const { guid: playlistGuid, turnOn, turnOff } = useCurrentPlaylist()

	const onCreateClick = () => {
		setCreateLoading(true)
		createPlaylist()
	}

	const createPlaylist = async () => {
		try {
			const result = await createWithoutName()
			navigate('playlist', {
				guid: result,
			})
			turnOn(result)
		} catch (e: any) {
			console.log('Something went wrong:', e.message)
			setCreateLoading(false)
		}
	}

	const askToDeletePlaylist = async (guid: PlaylistGuid, title: string) => {
		setDeletingTitle(title)
		setDeletingGuid(guid)
		setOpenDialog(true)
	}
	const deletePlaylist = async (guid: PlaylistGuid) => {
		if (playlistGuid === guid) turnOff()
		deleteByGuid(guid)
			.then((result) => {
				reload()
			})
			.catch((e: any) => {
				console.log('Something went wrong:', e.message)
			})
	}

	const openPlaylist = (guid: PlaylistGuid) => {
		navigate('playlist', {
			guid,
		})
	}
	const { isOn, guid: currentPlaylistGuid } = useCurrentPlaylist()

	const ListPlaylistItem = ({
		name,
		guid,
	}: {
		name: string
		guid: PlaylistGuid
	}) => {
		return (
			<StyledContainer
				sx={{
					padding: 0,
					marginBottom: 1,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Button onClick={() => openPlaylist(guid)} fullWidth color="warning">
					{name}
				</Button>
				<IconButton>
					<Remove onClick={() => askToDeletePlaylist(guid, name)} />
				</IconButton>
				<Box position={'absolute'} marginLeft={1}>
					{isOn && currentPlaylistGuid == guid ? (
						<Chip label={'Aktivní'} size="small" color="secondary" />
					) : (
						<></>
					)}
				</Box>
			</StyledContainer>
		)
	}

	return (
		<Box display={'flex'} justifyContent={'center'} padding={1}>
			<Box sx={{ maxWidth: 500, marginTop: 7 }} flex={1}>
				{error ? (
					<>
						<Typography>Při načítání nastala chyba.</Typography>
						<Typography>{error.message}</Typography>
					</>
				) : (
					<></>
				)}
				<Box display={'flex'} marginBottom={3}>
					<Typography variant="h5" fontWeight={600} flex={1}>
						Moje playlisty:
					</Typography>

					<LoadingButton
						loading={createLoading}
						loadingPosition="start"
						startIcon={<Add />}
						variant="contained"
						onClick={onCreateClick}
					>
						Vytvořit
					</LoadingButton>
				</Box>
				{!loaded ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							flex: 1,
							color: 'black',
						}}
					>
						<Typography>Načítání playlistů...</Typography>
						<Gap horizontal />
						<CircularProgress size={'2rem'} color="inherit" />
					</Box>
				) : (
					<>
						{playlists?.map((p) => {
							return (
								<ListPlaylistItem
									name={p.title}
									guid={p.guid as PlaylistGuid}
									key={p.guid}
								/>
							)
						})}

						{playlists?.length == 0 && (
							<>
								<Typography>Nemáš žádný vytvořený playlist.</Typography>
							</>
						)}
					</>
				)}
			</Box>
			<Dialog
				open={openDialog}
				title="Opravdu chcete odstranit playlist?"
				buttons={
					<>
						<Button
							onClick={() => setOpenDialog(false)}
							variant="outlined"
							// size="small"
						>
							Zrušit
						</Button>
						<Button
							onClick={() => {
								if (deletingGuid) deletePlaylist(deletingGuid)
								setOpenDialog(false)
							}}
							color="error"
							variant="contained"
							// size="small"
						>
							Smazat
						</Button>
					</>
				}
			>
				<Typography>
					Chcete opravdu smazat playlist <strong>{deletingTitle}</strong>? Tato
					akce je nevratná.
				</Typography>
			</Dialog>
		</Box>
	)
}
