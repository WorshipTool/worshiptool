import { VariantPackAlias } from '@/api/dtos'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { parseVariantAlias } from '@/routes/routes.tech'
import { Add, Edit, Remove } from '@mui/icons-material'
import { Box } from '@mui/material'
import { Chord, Sheet } from '@pepavlin/sheet-api'
import { memo } from 'react'

type TopPlaylistItemPanelProps = {
	itemGuid: PlaylistItemGuid
	packAlias: VariantPackAlias
	sheet: Sheet
	inEditMode: boolean
	setInEditMode: (value: boolean) => void
	onSave: () => void
	onCancel: () => void
	// rerender: () => void
	openButton?: React.ReactNode
}

export const TopPlaylistItemPanel = memo(function TopPlaylistItemPanel({
	...props
}: TopPlaylistItemPanelProps) {
	const { setItemKeyChord, removeItem, canUserEdit } = useInnerPlaylist()

	const transpose = async (value: number) => {
		const c = props.sheet.getKeyChord()

		const copyChord = c ? new Chord(c.toString()) : null
		copyChord?.transpose(value)

		if (copyChord) setItemKeyChord(props.itemGuid, copyChord)
	}

	const onRemove = async () => {
		removeItem(props.itemGuid)
	}

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'space-between'}
			sx={{
				zIndex: 1,
			}}
		>
			{canUserEdit ? (
				<Box
					display={{
						xs: 'none',
						sm: 'flex',
					}}
				>
					<IconButton
						onClick={() => {
							transpose(1)
						}}
						color="inherit"
					>
						<Add />
					</IconButton>
					<IconButton
						onClick={() => {
							transpose(-1)
						}}
						color="inherit"
					>
						<Remove />
					</IconButton>
				</Box>
			) : (
				<Box />
			)}
			<Box />

			<Box display={'flex'} flexDirection={'row'} gap={1} sx={{}}>
				{!props.inEditMode ? (
					<Button
						tooltip="Vytvořit úpravu písně pro tento playlist"
						variant="outlined"
						size="small"
						startIcon={<Edit />}
						onClick={() => {
							props.setInEditMode(true)
						}}
					>
						Upravit
					</Button>
				) : (
					<>
						<Button
							size="small"
							variant="text"
							color="grey.800"
							onClick={props.onCancel}
							tooltip="Zrušit aktuální úpravy"
						>
							Zrušit
						</Button>
						<Button
							size="small"
							onClick={props.onSave}
							tooltip="Uložit aktuální stav písně"
						>
							Uložit
						</Button>
					</>
				)}
				{canUserEdit && !props.inEditMode && (
					<Box
						display={{
							xs: 'none',
							sm: 'block',
						}}
					>
						<Button
							variant="text"
							color="error"
							onClick={onRemove}
							size="small"
						>
							Odebrat z playlistu
						</Button>
					</Box>
				)}
				{!props.inEditMode &&
					(props.openButton || (
						<Button
							variant="text"
							to="variant"
							toParams={{
								...parseVariantAlias(props.packAlias),
							}}
							size="small"
						>
							Otevřít
						</Button>
					))}
			</Box>
		</Box>
	)
})

export default TopPlaylistItemPanel
