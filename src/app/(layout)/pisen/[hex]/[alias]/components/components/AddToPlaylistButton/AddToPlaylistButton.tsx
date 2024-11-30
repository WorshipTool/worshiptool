import { PlaylistData } from '@/api/generated'
import AddToPlaylistMenuItem from '@/app/(layout)/pisen/[hex]/[alias]/components/components/AddToPlaylistButton/AddToPlaylistMenuItem'
import SelectPlaylistMenu from '@/common/components/Menu/SelectPlaylistMenu/SelectPlaylistMenu'
import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { useDownSize } from '@/common/hooks/useDownSize'
import { useTheme } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	useMediaQuery,
} from '@/common/ui/mui'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { KeyboardArrowDown, PlaylistAddCircle } from '@mui/icons-material'
import React, { useCallback, useMemo } from 'react'
import { SongVariantDto } from '../../../../../../../../api/dtos'

interface AddToPlaylistButtonProps {
	variant: SongVariantDto
	asMenuItem?: boolean
}

export default function AddToPlaylistButton({
	variant,
	asMenuItem,
}: AddToPlaylistButtonProps) {
	const [open, setOpen] = React.useState(false)

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setOpen(true)
		setAnchorEl(event.currentTarget)
	}, [])

	const handleMenuClick = useCallback((event: any) => {
		handleClick(event)
	}, [])

	const handleClose = useCallback(() => {
		setOpen(false)
		setAnchorEl(null)
	}, [])

	const theme = useTheme()

	const itemComponent = useCallback((playlist: PlaylistData) => {
		return (
			<AddToPlaylistMenuItem
				key={playlist.guid}
				variant={variant}
				guid={playlist.guid as PlaylistGuid}
				title={playlist.title}
			/>
		)
	}, [])

	const isSmall = useDownSize('sm')

	const shortenTitle = useMediaQuery('(max-width: 700px)')

	const buttonComponent = useMemo(
		() => (
			<>
				{!isSmall ? (
					<Button
						onClick={handleClick}
						variant="contained"
						endIcon={<KeyboardArrowDown />}
					>
						{shortenTitle ? 'Přidat do' : 'Přidat do playlistu'}
					</Button>
				) : (
					<SmartPortalMenuItem
						title={'Přidat do playlistu'}
						onClick={handleClick}
						icon={<KeyboardArrowDown />}
					/>
				)}
			</>
		),
		[handleClick, theme, isSmall, shortenTitle]
	)

	return (
		<>
			{asMenuItem ? (
				<MenuItem onClick={handleMenuClick}>
					<ListItemIcon>
						<PlaylistAddCircle />
					</ListItemIcon>
					<ListItemText primary={'Přidat do playlistu'} />
				</MenuItem>
			) : (
				buttonComponent
			)}

			<SelectPlaylistMenu
				open={open}
				onClose={handleClose}
				anchor={anchorEl}
				itemComponent={itemComponent}
			/>
		</>
	)
}
