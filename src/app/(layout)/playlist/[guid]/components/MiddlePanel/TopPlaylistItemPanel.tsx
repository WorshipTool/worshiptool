import { VariantPackAlias } from '@/api/dtos'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { parseVariantAlias } from '@/routes'
import { Add, Remove } from '@mui/icons-material'
import { Box } from '@mui/material'
import { Chord, Sheet } from '@pepavlin/sheet-api'
import { memo } from 'react'

type TopPlaylistItemPanelProps = {
	itemGuid: PlaylistItemGuid
	packAlias: VariantPackAlias
	sheet: Sheet
	// rerender: () => void
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

			<Box display={'flex'} flexDirection={'row'} sx={{}}>
				{canUserEdit && (
					<Box
						display={{
							xs: 'none',
							sm: 'block',
						}}
					>
						<Button variant="text" color="error" onClick={onRemove}>
							Odebrat z playlistu
						</Button>
					</Box>
				)}
				<Button
					variant="text"
					to="variant"
					toParams={{
						...parseVariantAlias(props.packAlias),
					}}
				>
					Otevřít
				</Button>
			</Box>
		</Box>
	)
})

export default TopPlaylistItemPanel
