import { VariantPackGuid } from '@/api/dtos'
import { useApi } from '@/api/tech-and-hooks/useApi'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import Menu from '@/common/components/Menu/Menu'
import SelectPlaylistMenu from '@/common/components/Menu/SelectPlaylistMenu/SelectPlaylistMenu'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { usePermission } from '@/hooks/permissions/usePermission'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import usePlaylistsGeneral from '@/hooks/playlist/usePlaylistsGeneral'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Add, LibraryAdd } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'

type SelectedPanelProps = {
	selectedPacks: VariantPackGuid[]
	onCancelSelect: () => void
}

export default function SelectedPanel({
	selectedPacks: selected,
	...props
}: SelectedPanelProps) {
	const { selection, guid: teamGuid, alias } = useInnerTeam()
	const { addPacksToPlaylist, createPlaylist } = usePlaylistsGeneral()

	const { teamEditingApi } = useApi()

	const [optionsElement, setOptionsElement] = useState<HTMLElement | null>(null)
	const [optionsMenuOpen, setOptionsMenuOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()

	const [playlistMenuAnchor, setPlaylistMenuAnchor] =
		useState<HTMLElement | null>(null)
	const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false)

	const closeAll = useCallback(() => {
		setOptionsMenuOpen(false)
		setPlaylistMenuOpen(false)
	}, [])

	const onRemoveSelected = useCallback(() => {
		selection.removePacks(selected)
		props.onCancelSelect()
	}, [selected])

	const onOptionClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setOptionsElement(event.currentTarget)
		setOptionsMenuOpen(true)
	}, [])

	const onAddToPlaylistClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			setPlaylistMenuOpen(true)
			setPlaylistMenuAnchor(e.currentTarget)
			return false
		},
		[]
	)

	const navigate = useSmartNavigate()
	const { turnOn } = useCurrentPlaylist()

	const onCreateNewPlaylistClick = useCallback(
		async (e: React.MouseEvent) => {
			// 1. Create new playlist
			const newGuid = await createPlaylist()

			await teamEditingApi.teamSelectionControllerAttachPlaylistToTeam({
				playlistGuid: newGuid,
				teamGuid,
			})

			// 2. Add selected songs to playlist
			const results = await addPacksToPlaylist(selected, newGuid)

			// const url = getRouteUrlWithParams('playlist', { guid: newGuid })
			navigate('teamPlaylist', { guid: newGuid, alias })
			// window.open(url, '_blank') // Open in new tab

			closeAll()
			turnOn(newGuid)
		},
		[selected, teamGuid]
	)

	const onAddToPlaylist = useCallback(
		async (playlistGuid: PlaylistGuid) => {
			// selection.addPacksToPlaylist(selected, playlistId)
			const results = await addPacksToPlaylist(selected, playlistGuid)
			if (results.length > 0) {
				enqueueSnackbar('Písně byly přidány do playlistu', {
					variant: 'success',
				})
			} else {
				enqueueSnackbar(
					'Při přidávání nastala chyba. Do playlistu nelze přidat píseň, která tam už je.',
					{
						// variant: 'error',
						autoHideDuration: 8000,
					}
				)
			}
			closeAll()
		},
		[selected, closeAll]
	)

	const removeSongPermission = usePermission<TeamPermissions>(
		'team.remove_song',
		{
			teamGuid,
		}
	)

	return (
		<>
			<Box
				display={'flex'}
				flexDirection={'row'}
				gap={1}
				alignItems={'center'}
				justifyContent={'space-between'}
				flex={1}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={1}
					alignItems={'center'}
				>
					<Button
						variant="outlined"
						color="black"
						size="small"
						onClick={props.onCancelSelect}
					>
						Zrušit výběr
					</Button>
					{selected.length === 0 ? (
						<Typography>Kliknutím vyberte písně</Typography>
					) : (
						<>
							<Box>
								<Typography>
									{selected.length === 1
										? `Vybrána 1 píseň`
										: selected.length < 5
										? `Vybrány ${selected.length} písně`
										: `Vybráno ${selected.length} písní`}
								</Typography>
							</Box>
						</>
					)}
				</Box>
				<Box display={'flex'} flexDirection={'row'} gap={2}>
					{/* Actions */}
					<Button
						size="small"
						color="black"
						variant="text"
						// endIcon={optionIcon}
						onClick={onOptionClick}
						disabled={selected.length === 0}
					>
						Možnosti
					</Button>
					{removeSongPermission && (
						<Button
							color="error"
							size="small"
							onClick={onRemoveSelected}
							disabled={selected.length === 0}
						>
							Odstranit
						</Button>
					)}
				</Box>
			</Box>
			<Menu
				open={optionsMenuOpen}
				onClose={() => setOptionsMenuOpen(false)}
				anchor={optionsElement}
				items={[
					// {
					// 	icon: <Delete />,
					// 	title: 'Odstranit',
					// },
					{
						title: 'Nový playlist',
						subtitle: 'Vytvořit z písní nový playlist',
						icon: <Add />,
						onClick: onCreateNewPlaylistClick,
					},
					{
						title: 'Přidat do playlistu',
						subtitle: 'Vyberte z již vytvořených playlistů',
						icon: <LibraryAdd />,
						onClick: onAddToPlaylistClick,
					},
				]}
			></Menu>

			<SelectPlaylistMenu
				open={playlistMenuOpen}
				onClose={() => setPlaylistMenuOpen(false)}
				anchor={playlistMenuAnchor}
				onPlaylistClick={onAddToPlaylist}
			/>
		</>
	)
}
