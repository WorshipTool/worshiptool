import Menu from '@/common/components/Menu/Menu'
import MenuItem from '@/common/components/Menu/MenuItem'
import { Box } from '@/common/ui'
import { IconButton } from '@/common/ui/IconButton'
import ChildrenCounter from '@/tech/portal/ChildrenCounter'
import { MoreVert } from '@mui/icons-material'
import { useState } from 'react'

export const MORE_TEAM_SONG_BUTTON_ID = 'more-team-song-button'

export const CHILDREN_UPDATE_MORE_TEAM_SONG_BUTTON_EVENT_NAME =
	'update-more-team-song-button'

export default function MoreTeamSongButton() {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)
	const [open, setOpen] = useState(false)

	const onClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchor(event.currentTarget)
		setOpen(true)
	}

	const [itemsCount, setItemsCount] = useState(0)

	const onCountChange = (count: number) => {
		setItemsCount(count)

		if (count === 0) {
			setOpen(false)
		}
	}

	return (
		<>
			{itemsCount > 0 && (
				<IconButton size="small" onClick={onClick}>
					<MoreVert />
				</IconButton>
			)}

			<Menu
				anchor={anchor}
				open={open}
				onClose={() => setOpen(false)}
				keepMounted
				// id={MORE_TEAM_SONG_BUTTON_ID}
			>
				<ChildrenCounter onCountChange={onCountChange}>
					<Box id={MORE_TEAM_SONG_BUTTON_ID}></Box>
				</ChildrenCounter>
				{itemsCount === 0 && (
					<MenuItem title={'Žádná volba dostupná'} disabled />
				)}
			</Menu>
		</>
	)
}
