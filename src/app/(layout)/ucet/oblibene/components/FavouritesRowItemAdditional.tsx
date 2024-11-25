import { SongVariantDto } from '@/api/dtos'
import Menu from '@/common/components/Menu/Menu'
import { IconButton } from '@/common/ui'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import {
	KeyboardArrowLeft,
	MoreHoriz,
	PlaylistRemove,
} from '@mui/icons-material'
import { useState } from 'react'

type FavouritesRowItemAdditionalProps = {
	data: SongVariantDto
	onOpenClick: () => void
}

export default function FavouritesRowItemAdditional(
	props: FavouritesRowItemAdditionalProps
) {
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const { remove, loading } = useFavourites()

	const onRemove = () => {
		remove(props.data.packGuid)
	}

	return (
		<>
			<IconButton
				disabled={loading}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()

					setOpen(true)
					setAnchor(e.currentTarget)
				}}
			>
				<MoreHoriz />
			</IconButton>

			<Menu
				open={open}
				anchor={anchor}
				onClose={() => setOpen(false)}
				items={[
					{
						title: 'Otevřít',
						onClick: props.onOpenClick,
						icon: <KeyboardArrowLeft />,
					},
					{
						title: 'Odebrat',
						subtitle: 'Odebrat z oblíbených',
						onClick: onRemove,
						icon: <PlaylistRemove />,
						disabled: loading,
					},
				]}
			/>
		</>
	)
}
