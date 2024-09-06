import { PlaylistData } from '@/api/generated'
import Menu from '@/common/components/Menu/Menu'
import PlaylistMenuItem from '@/common/components/Menu/SelectPlaylistMenu/PlaylistMenuItem'
import Popup from '@/common/components/Popup/Popup'
import usePlaylistsGeneral from '@/hooks/playlist/usePlaylistsGeneral'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useApiStateEffect } from '@/tech/ApiState'
import { MoreHoriz } from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	ListItemIcon,
	ListItemText,
	MenuItem,
	useTheme,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

type SelectPlaylistMenuProps = {
	open: boolean
	onClose: () => void
	anchor: HTMLElement | null
	onPlaylistClick?: (guid: PlaylistGuid) => void

	itemComponent?: (props: PlaylistData) => JSX.Element
}
const MAX_PLAYLIST_COUNT = 4

export default function SelectPlaylistMenu(props: SelectPlaylistMenuProps) {
	// Playlist list
	const { getPlaylistsOfUser } = usePlaylistsGeneral()
	const [{ data: playlists, loading }] = useApiStateEffect(() => {
		return getPlaylistsOfUser().then((r) => {
			return r.playlists
		})
	}, [])

	// Dialog state
	const [popupOpen, setPopupOpen] = useState(false)

	useEffect(() => {
		if (!props.open) setPopupOpen(false)
	}, [props.open])

	const theme = useTheme()

	const onPlaylistClick = useCallback(
		(guid: PlaylistGuid) => {
			props.onPlaylistClick?.(guid)
		},
		[props.onPlaylistClick]
	)

	return (
		<>
			<Menu
				anchor={props.anchor}
				// anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={props.open}
				onClose={props.onClose}
			>
				{loading ? (
					<MenuItem disabled key={'loading-aoihh'}>
						<ListItemIcon>
							<CircularProgress size={`1rem`} color="inherit" />
						</ListItemIcon>
						<ListItemText>Načítání...</ListItemText>
					</MenuItem>
				) : (
					playlists?.length === 0 && (
						<MenuItem disabled key={'no-playlists-title-aflkj'}>
							<ListItemText>Nemáte žádné playlisty</ListItemText>
						</MenuItem>
					)
				)}
				{playlists?.slice(0, MAX_PLAYLIST_COUNT).map((p, i) => {
					return (
						props.itemComponent?.(p) || (
							<PlaylistMenuItem
								key={p.guid}
								guid={p.guid as PlaylistGuid}
								title={p.title}
								onClick={() => onPlaylistClick(p.guid as PlaylistGuid)}
							/>
						)
					)
				})}
				{playlists &&
					playlists.length > MAX_PLAYLIST_COUNT && [
						<div
							key={'div-with-divider'}
							style={{
								paddingTop: theme.spacing(1),
								paddingBottom: theme.spacing(1),
							}}
						>
							<Divider />
						</div>,

						<MenuItem onClick={() => setPopupOpen(true)} key={'more-titel'}>
							<ListItemIcon>
								<MoreHoriz fontSize="small" />
							</ListItemIcon>
							<ListItemText>Další</ListItemText>
						</MenuItem>,
					]}
			</Menu>
			<Popup open={popupOpen} onClose={() => setPopupOpen(false)}>
				<DialogTitle>Přidat do playlistu</DialogTitle>
				<DialogContent>
					<Box>
						{playlists?.map((p, i) => {
							return (
								props.itemComponent?.(p) || (
									<PlaylistMenuItem
										key={p.guid}
										guid={p.guid as PlaylistGuid}
										title={p.title}
										onClick={() => onPlaylistClick(p.guid as PlaylistGuid)}
									/>
								)
							)
						})}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPopupOpen(false)}>Zavřít</Button>
				</DialogActions>
			</Popup>
		</>
	)
}
