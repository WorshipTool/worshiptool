import PlaylistMenuItem from '@/common/components/Menu/SelectPlaylistMenu/PlaylistMenuItem'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { CheckCircle, PlaylistAdd } from '@mui/icons-material'
import { Box, CircularProgress } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { SongVariantDto } from '../../../../../../../../api/dtos'
import usePlaylistsGeneral from '../../../../../../../../hooks/playlist/usePlaylistsGeneral'

interface PlaylistMenuItemProps {
	variant: SongVariantDto
	guid: PlaylistGuid
	title: string
}

export default function AddToPlaylistMenuItem({
	variant,
	guid: playlistGuid,
	title,
}: PlaylistMenuItemProps) {
	const {
		addVariantToPlaylist: addToPlaylist,
		removeVariantFromPlaylist: removeFromPlaylist,
	} = usePlaylistsGeneral()
	const { isVariantInPlaylist } = usePlaylistsGeneral()

	const [loading, setLoading] = React.useState(true)
	const [isInPlaylist, setIsInPlaylist] = React.useState<boolean>(false)

	const reloadPlaylists = () => {
		return isVariantInPlaylist(variant.packGuid, playlistGuid).then((r) => {
			setIsInPlaylist(r)
		})
	}

	useEffect(() => {
		if (variant) {
			setLoading(true)
			reloadPlaylists().then(() => setLoading(false))
		}
	}, [variant])

	const addVariantToPlaylist = useCallback(
		(playlistGuid: PlaylistGuid) => {
			setLoading(true)

			try {
				addToPlaylist(variant.packGuid, playlistGuid).then(async (result) => {
					await reloadPlaylists()
					setLoading(false)
				})
			} catch (e) {
				console.log(e)
			}
		},
		[variant.packGuid, playlistGuid]
	)

	const removeVariantFromPlaylist = useCallback(
		(playlistGuid: PlaylistGuid) => {
			setLoading(true)

			try {
				removeFromPlaylist(variant.packGuid, playlistGuid).then(
					async (result) => {
						await reloadPlaylists()
						setLoading(false)
					}
				)
			} catch (e) {
				console.log(e)
			}
		},
		[variant.packGuid, playlistGuid]
	)

	const onClick = useCallback(() => {
		if (!isInPlaylist) addVariantToPlaylist(playlistGuid)
		else removeVariantFromPlaylist(playlistGuid)
	}, [
		isInPlaylist,
		playlistGuid,
		addVariantToPlaylist,
		removeVariantFromPlaylist,
	])
	return (
		<PlaylistMenuItem
			guid={playlistGuid}
			title={title}
			onClick={onClick}
			icon={
				loading ? (
					<CircularProgress size={'1rem'} color="inherit" />
				) : !isInPlaylist ? (
					<PlaylistAdd fontSize="small" />
				) : (
					<Box color={'grey.800'}>
						<CheckCircle fontSize="small" color="inherit" />
					</Box>
				)
			}
		/>
	)
}
