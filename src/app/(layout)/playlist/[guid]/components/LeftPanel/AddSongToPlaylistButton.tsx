import { VariantPackGuid } from '@/api/dtos'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Add } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function AddSongToPlaylistButton() {
	const { addItem, items, ...playlist } = useInnerPlaylist()

	const anchorRef = useRef<HTMLButtonElement>(null)

	const [open, setOpen] = useState(false)
	const onClick = (e: React.MouseEvent) => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	const onSubmit = async (packs: VariantPackGuid[]) => {
		for (const pack of packs) {
			await addItem(pack)
		}
	}

	const filterFunc = (pack: VariantPackGuid) => {
		return !items.some((i) => i.variant.packGuid === pack)
	}

	// Auto open
	const [thereHasBeenItems, setThereHasBeenItems] = useState(false)
	useEffect(() => {
		if (playlist.loading) return

		// after one second, the popup will open
		const t = setTimeout(() => {
			if (items.length === 0 && thereHasBeenItems === false) {
				setOpen(true)
			} else if (thereHasBeenItems === false) {
				setThereHasBeenItems(true)
			}
		}, 1000)

		return () => {
			clearTimeout(t)
		}
	}, [items, thereHasBeenItems])

	return (
		<>
			<Box sx={{}}>
				<Tooltip label="Přidat píseň do playlistu">
					<Fab onClick={onClick} ref={anchorRef} size="medium" color="primary">
						<Add />
					</Fab>
				</Tooltip>
				{/* <Button
					endIcon={<Add />}
					onClick={onClick}
					ref={anchorRef}
					variant="text"
					color="black"
				>
					Přidat píseň
				</Button> */}
			</Box>
			<SongSelectPopup
				onClose={onClose}
				open={open}
				anchorRef={anchorRef}
				anchorName={'AddToPlaylistBUtton'}
				upDirection
				onSubmit={onSubmit}
				filterFunc={filterFunc}
				disableMultiselect
			/>
		</>
	)
}
