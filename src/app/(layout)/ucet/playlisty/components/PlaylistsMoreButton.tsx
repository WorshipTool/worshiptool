import Menu from '@/common/components/Menu/Menu'
import { IconButton } from '@/common/ui/IconButton'
import { MoreHoriz } from '@mui/icons-material'
import { useState } from 'react'

export default function PlaylistsMoreButton() {
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)
	return (
		<>
			<IconButton
				variant="contained"
				color="grey.300"
				squared
				onClick={(e) => {
					setAnchor(e.currentTarget)
					setOpen(true)
				}}
			>
				<MoreHoriz />
			</IconButton>

			<Menu
				open={open}
				onClose={() => setOpen(false)}
				anchor={anchor}
				items={[
					{
						title: 'holahej',
					},
				]}
			/>
		</>
	)
}
