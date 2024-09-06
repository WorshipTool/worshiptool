import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { IconButton } from '@/common/ui/IconButton'
import { Link } from '@/common/ui/Link/Link'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { Launch } from '@mui/icons-material'
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import React, { MouseEvent } from 'react'

interface PlaylistMenuItemProps {
	guid: PlaylistGuid
	title: string
	disabled?: boolean
	icon?: React.ReactNode

	hideLink?: boolean

	onClick?: (e: React.MouseEvent) => void
}

export default function PlaylistMenuItem({
	guid: playlistGuid,
	title,
	...props
}: PlaylistMenuItemProps) {
	const openPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	const onClick = (e: MouseEvent) => {
		props.onClick?.(e)
	}

	return (
		<MenuItem
			key={playlistGuid + 'pl'}
			disabled={props.disabled}
			onClick={onClick}
		>
			<Box
				sx={{
					flexDirection: 'row',
					display: 'flex',
				}}
			>
				{props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}

				<ListItemText primary={title} />
			</Box>

			{!props.hideLink && (
				<Tooltip label="Otevřít v nové záložce">
					<Link
						to="playlist"
						params={{
							guid: playlistGuid,
						}}
						newTab
					>
						<IconButton
							onClick={openPlaylist}
							size="small"
							sx={{
								marginY: '-5px',
								marginX: '-4px',
								transform: 'scale(0.8)',
							}}
						>
							<Launch fontSize="small" />
						</IconButton>
					</Link>
				</Tooltip>
			)}
		</MenuItem>
	)
}
