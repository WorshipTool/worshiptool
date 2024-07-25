import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import {
	KeyboardArrowDown,
	MoreHoriz,
	PlaylistAddCircle,
} from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	useTheme,
} from '@mui/material'
import React from 'react'
import { SongVariantDto } from '../../../../../../../../api/dtos'
import usePlaylistsGeneral from '../../../../../../../../hooks/playlist/usePlaylistsGeneral'
import { useApiStateEffect } from '../../../../../../../../tech/ApiState'
import PlaylistMenuItem from './PlaylistMenuItem'

interface AddToPlaylistButtonProps {
	variant: SongVariantDto
	asMenuItem?: boolean
}

export default function AddToPlaylistButton({
	variant,
	asMenuItem,
}: AddToPlaylistButtonProps) {
	const [open, setOpen] = React.useState(false)

	const [openDialog, setOpenDialog] = React.useState(false)

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setOpen(true)
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClick = (event: any) => {
		handleClick(event)
	}

	const handleClose = () => {
		setOpen(false)
		setAnchorEl(null)
	}

	const { getPlaylistsOfUser, isVariantInPlaylist } = usePlaylistsGeneral()
	const [{ data: playlists, loading }] = useApiStateEffect(() => {
		return getPlaylistsOfUser().then((r) => {
			return r.playlists
		})
	}, [])

	const theme = useTheme()
	const maxItems = 4

	return (
		<>
			{' '}
			{asMenuItem ? (
				<MenuItem onClick={handleMenuClick}>
					<ListItemIcon>
						<PlaylistAddCircle />
					</ListItemIcon>
					<ListItemText primary={'Přidat do playlistu'} />
				</MenuItem>
			) : (
				<>
					<Button
						onClick={handleClick}
						variant="contained"
						endIcon={<KeyboardArrowDown />}
						sx={{
							[theme.breakpoints.down('sm')]: {
								display: 'none',
							},
						}}
					>
						Přidat do playlistu
					</Button>
				</>
			)}
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				[
				{loading ? (
					<MenuItem disabled>
						<ListItemIcon>
							<CircularProgress size={`1rem`} color="inherit" />
						</ListItemIcon>
						<ListItemText>Načítání...</ListItemText>
					</MenuItem>
				) : (
					playlists?.length === 0 && (
						<>
							<MenuItem disabled>
								<ListItemText>Nemáte žádné playlisty</ListItemText>
							</MenuItem>
						</>
					)
				)}
				{playlists?.slice(0, maxItems).map((p, i) => {
					return (
						<PlaylistMenuItem
							key={p.guid}
							guid={p.guid as PlaylistGuid}
							title={p.title}
							variant={variant}
						/>
					)
				})}
				{playlists && playlists.length > maxItems && (
					<>
						<div
							style={{
								paddingTop: theme.spacing(1),
								paddingBottom: theme.spacing(1),
							}}
						>
							<Divider />
						</div>

						<MenuItem onClick={() => setOpenDialog(true)}>
							<ListItemIcon>
								<MoreHoriz fontSize="small" />
							</ListItemIcon>
							<ListItemText>Další</ListItemText>
						</MenuItem>
					</>
				)}
				]
			</Menu>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Přidat do playlistu</DialogTitle>
				<DialogContent>
					<Box>
						{playlists?.map((p, i) => {
							return (
								<PlaylistMenuItem
									key={p.guid}
									guid={p.guid as PlaylistGuid}
									title={p.title}
									variant={variant}
								/>
							)
						})}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Zavřít</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
