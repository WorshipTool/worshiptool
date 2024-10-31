import Menu from '@/common/components/Menu/Menu'
import { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { IconButton } from '@/common/ui/IconButton'
import { MoreVert } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

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

	const items: MenuItemObjectType[] = [
		// {
		// 	title: 'Přidat sdílenou poznámku',
		// 	icon: <StickyNote2 />,
		// },
	]

	const [itemsCount, setItemsCount] = useState(0)

	useEffect(() => {
		const updateMoreTeamSongButton = () => {
			const itemsCount = items.length

			const childrenCount = document.querySelectorAll(
				`#${MORE_TEAM_SONG_BUTTON_ID} > *`
			).length

			const sum = itemsCount + childrenCount
			setItemsCount(sum)
		}

		window.addEventListener(
			CHILDREN_UPDATE_MORE_TEAM_SONG_BUTTON_EVENT_NAME,
			updateMoreTeamSongButton
		)

		return () => {
			window.removeEventListener(
				CHILDREN_UPDATE_MORE_TEAM_SONG_BUTTON_EVENT_NAME,
				updateMoreTeamSongButton
			)
		}
	}, [items.length])

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
				items={items}
				keepMounted
				// id={MORE_TEAM_SONG_BUTTON_ID}
			>
				<Box id={MORE_TEAM_SONG_BUTTON_ID}></Box>
			</Menu>
		</>
	)
}
