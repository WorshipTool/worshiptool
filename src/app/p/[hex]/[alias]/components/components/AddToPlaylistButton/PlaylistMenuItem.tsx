import { CheckCircle, Launch, PlaylistAdd } from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
} from '@mui/material'
import React, { useEffect } from 'react'
import { SongVariantDto } from '../../../../../../../api/dtos'
import { Gap } from '../../../../../../../common/ui/Gap'
import { Link } from '../../../../../../../common/ui/Link/CustomLink'
import usePlaylists from '../../../../../../../hooks/playlist/usePlaylists'

interface PlaylistMenuItemProps {
	variant: SongVariantDto
	guid: string
	title: string
}

export default function PlaylistMenuItem({
	variant,
	guid: playlistGuid,
	title,
}: PlaylistMenuItemProps) {
	const {
		addVariantToPlaylist: addToPlaylist,
		removeVariantFromPlaylist: removeFromPlaylist,
	} = usePlaylists()
	const { isVariantInPlaylist } = usePlaylists()

	const [loading, setLoading] = React.useState(true)
	const [isInPlaylist, setIsInPlaylist] = React.useState<boolean>(false)

	useEffect(() => {
		if (variant) {
			setLoading(true)
			isVariantInPlaylist(variant.alias, playlistGuid).then((r) => {
				setIsInPlaylist(r)
				setLoading(false)
			})
		}
	}, [variant])

	const reloadPlaylists = () => {
		return isVariantInPlaylist(variant.alias, playlistGuid).then((r) => {
			setIsInPlaylist(r)
		})
	}

	const addVariantToPlaylist = (guid: string) => {
		setLoading(true)

		try {
			addToPlaylist(variant.alias, guid).then(async (result) => {
				await reloadPlaylists()
				setLoading(false)
			})
		} catch (e) {
			console.log(e)
		}
	}

	const removeVariantFromPlaylist = (guid: string) => {
		setLoading(true)

		try {
			removeFromPlaylist(variant.alias, guid).then(async (result) => {
				await reloadPlaylists()
				setLoading(false)
			})
		} catch (e) {
			console.log(e)
		}
	}
	const openPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<MenuItem
			key={playlistGuid + 'pl'}
			disabled={loading}
			onClick={() => {
				if (!isInPlaylist) addVariantToPlaylist(playlistGuid)
				else removeVariantFromPlaylist(playlistGuid)
			}}
		>
			<Box
				sx={{
					flexDirection: 'row',
					display: 'flex',
				}}
			>
				<ListItemIcon
					sx={{
						height: '10px',
						marginTop: '2px',
					}}
				>
					{loading ? (
						<CircularProgress size={'1rem'} color="inherit" />
					) : !isInPlaylist ? (
						<PlaylistAdd fontSize="small" />
					) : (
						<CheckCircle fontSize="small" />
					)}
				</ListItemIcon>

				<ListItemText primary={title} />
			</Box>
			<Gap horizontal value={1} />

			<Link
				to="playlist"
				params={{
					guid: playlistGuid,
				}}
				newTab
			>
				<IconButton
					onClick={openPlaylist}
					size="small"
					sx={{
						marginY: '-5px',
						marginX: '-4px',
						transform: 'scale(0.8)',
					}}
				>
					<Launch fontSize="small" />
				</IconButton>
			</Link>
		</MenuItem>
	)
}
