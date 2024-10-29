import { PlaylistData } from '@/api/generated'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import TeamPlaylistSelect from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamPlaylistSelect/TeamPlaylistSelect'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { Button } from '@/common/ui/Button'
import { Clickable } from '@/common/ui/Clickable'
import { Gap } from '@/common/ui/Gap'
import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState, useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Close, PushPin } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

export default function OtherPlaylistPanel() {
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<HTMLElement | null>(null)

	const { guid: teamGuid, alias: teamAlias } = useInnerTeam()

	const { teamPlaylistsApi } = useApi()
	const { fetchApiState: fetchPinApiState, apiState: pinApiState } =
		useApiState()

	const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
		setAnchor(e.currentTarget)
		setOpen(true)
	}, [])

	const startIcon = useMemo(() => <PushPin />, [])

	const [{ data: pinnedPlaylists, loading: pinnedPlaylistsLoading }, reload] =
		useApiStateEffect(async () => {
			const result = await handleApiCall(
				teamPlaylistsApi.teamPlaylistsControllerGetPinnedPlaylistsToTeam(
					teamGuid
				)
			)
			return result.playlists
		}, [teamGuid])

	const onPlaylistSelect = useCallback(
		(data: PlaylistData) => {
			setOpen(false)

			fetchPinApiState(
				async () => {
					return handleApiCall(
						teamPlaylistsApi.teamPlaylistsControllerPinPlaylistToTeam({
							teamGuid: teamGuid,
							playlistGuid: data.guid,
						})
					)
				},
				() => reload()
			)
		},
		[teamGuid, reload]
	)

	const onRemove = useCallback(
		(playlistGuid: string) => {
			fetchPinApiState(
				async () => {
					return handleApiCall(
						teamPlaylistsApi.teamPlaylistsControllerUnpinPlaylistFromTeam({
							teamGuid: teamGuid,
							playlistGuid: playlistGuid,
						})
					)
				},
				() => reload()
			)
		},
		[teamGuid, reload]
	)

	const filterFunc = useCallback(
		(playlist: PlaylistData) => {
			// Remove already added
			return !pinnedPlaylists?.some((p) => p.guid === playlist.guid)
		},
		[pinnedPlaylists]
	)

	const navigate = useSmartNavigate()

	const hasPermissionToAdd = usePermission<TeamPermissions>(
		'team.pin_playlist',
		{ teamGuid }
	)
	const hasPermissionToRemove = usePermission<TeamPermissions>(
		'team.unpin_playlist',
		{ teamGuid }
	)

	return !hasPermissionToAdd && pinnedPlaylists?.length === 0 ? null : (
		<TeamCard>
			<Box
				display={'flex'}
				flexDirection={'row'}
				justifyContent={'space-between'}
			>
				<Typography variant="h6">Připnuté playlisty</Typography>
				<Box display={'flex'}>
					{hasPermissionToAdd && (
						<Button
							variant="outlined"
							onClick={handleOpen}
							startIcon={startIcon}
							loading={pinApiState.loading}
							size="small"
						>
							Připnout playlist
						</Button>
					)}
				</Box>
			</Box>
			<Gap />
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				{pinnedPlaylists?.map((playlist) => (
					<Clickable
						tooltip="Otevřít playlist"
						key={playlist.guid}
						onClick={() =>
							navigate('teamPlaylist', {
								alias: teamAlias,
								guid: playlist.guid,
							})
						}
					>
						<Box
							key={playlist.guid}
							display={'flex'}
							justifyContent={'space-between'}
							alignItems={'center'}
							flexDirection={'column'}
							sx={{
								// width: 150,
								// aspectRatio: '1 / 1',
								bgcolor: 'secondary.main',
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<Box
								flex={1}
								sx={{
									userSelect: 'none',
									cursor: 'pointer',
								}}
								margin={2}
								display={'flex'}
								flexDirection={'row'}
								gap={1}
								alignItems={'center'}
								justifyContent={'center'}
							>
								<PushPin />
								<Typography key={playlist.guid}>{playlist.title}</Typography>
								{hasPermissionToRemove && (
									<IconButton
										size="small"
										onClick={(e) => {
											onRemove(playlist.guid)
											e.stopPropagation()
										}}
										tooltip="Odebrat z připnutých playlistů"
									>
										<Close />
									</IconButton>
								)}
							</Box>

							{/* <Box display={'flex'} gap={1} alignItems={'center'}>
								{/* <Button
									size="small"
									variant="outlined"
									to="teamPlaylist"
									toParams={{
										alias: teamAlias,
										guid: playlist.guid,
									}}
								>
									Otevřít
								</Button> */}

							{/* </Box> */}
						</Box>
					</Clickable>
				))}
				{pinnedPlaylists?.length === 0 && (
					<Typography italic color="grey.700">
						Žádné připnuté playlisty
					</Typography>
				)}
			</Box>
			<Gap />

			<TeamPlaylistSelect
				open={open}
				onClose={() => setOpen(false)}
				anchor={anchor}
				onSelect={onPlaylistSelect}
				filterFunc={filterFunc}
			/>
		</TeamCard>
	)
}
