import { PlaylistData } from '@/api/generated'
import AddToPlaylistMenuItem from '@/app/(layout)/pisen/[hex]/[alias]/components/components/AddToPlaylistButton/AddToPlaylistMenuItem'
import SelectPlaylistMenu from '@/common/components/Menu/SelectPlaylistMenu/SelectPlaylistMenu'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { KeyboardArrowDown, PlaylistAddCircle } from '@mui/icons-material'
import {
	Button,
	ListItemIcon,
	ListItemText,
	MenuItem,
	useTheme,
} from '@mui/material'
import React from 'react'
import { SongVariantDto } from '../../../../../../../../api/dtos'
import usePlaylistsGeneral from '../../../../../../../../hooks/playlist/usePlaylistsGeneral'
import { useApiStateEffect } from '../../../../../../../../tech/ApiState'

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

	const itemComponent = (playlist: PlaylistData) => {
		return (
			<AddToPlaylistMenuItem
				variant={variant}
				guid={playlist.guid as PlaylistGuid}
				title={playlist.title}
			/>
		)
	}

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
			<SelectPlaylistMenu
				open={open}
				onClose={handleClose}
				anchor={anchorEl}
				itemComponent={itemComponent}
			/>
		</>
	)
}
