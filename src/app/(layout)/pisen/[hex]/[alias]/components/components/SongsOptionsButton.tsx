import Menu from '@/common/components/Menu/Menu'
import { Divider, IconButton, Tooltip, useTheme } from '@/common/ui'
import ChildrenCounter from '@/tech/portal/ChildrenCounter'
import { ExtendedVariantPack } from '@/types/song'
import { MoreVert } from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import React, { useState } from 'react'
import { SongDto } from '../../../../../../../api/dtos'
import useAuth from '../../../../../../../hooks/auth/useAuth'
import DeleteButton from './DeleteButton'
import SheetAdminButtons from './SheetAdminButtons'

type SongsOptionsButtonProps = {
	reloadSong: () => void
	variant: ExtendedVariantPack
	sheet: Sheet
	song: SongDto
	isInEditMode?: boolean
	onEditClick: (editable: boolean) => Promise<void>
	saving: boolean
	editedTitle: string
	isOwner: boolean
	anyChange: boolean
}

export const SONG_OPTIONS_BUTTON_ID = 'song-options-button'

export default function SongsOptionsButton(props: SongsOptionsButtonProps) {
	const [open, setOpen] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setOpen(true)
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setOpen(false)
		setAnchorEl(null)
	}

	const { isAdmin, isLoggedIn, isTrustee } = useAuth()
	const theme = useTheme()

	const [childrenCount, setChildrenCount] = useState(0)

	return (
		<>
			{childrenCount > 0 && (
				<Tooltip title={'Další možnosti'}>
					<IconButton onClick={handleClick}>
						<MoreVert />
					</IconButton>
				</Tooltip>
			)}
			<Menu
				id="basic-menu"
				anchor={anchorEl}
				open={open}
				onClose={handleClose}
				keepMounted
			>
				<ChildrenCounter onCountChange={setChildrenCount}>
					<div id={SONG_OPTIONS_BUTTON_ID}></div>
				</ChildrenCounter>

				{/* {isLoggedIn() && [
					props.isOwner && !props.variant.public && (
						<Box
							key={'edit-button'}
							sx={{
								[theme.breakpoints.up('md')]: {
									display: 'none',
								},
							}}
						>
							<EditButton
								inEditMode={props.isInEditMode}
								sheetData={props.variant.sheetData}
								title={props.variant.preferredTitle}
								loading={props.saving}
								asMenuItem
								onClick={props.onEditClick}
								anyChange={props.anyChange}
							/>
						</Box>
					),
					props.isOwner ? (
						<CreateCopyButton
							variantGuid={props.variant.guid}
							asMenuItem
							key={'create-copy-button'}
						/>
					) : (
						<Box
							key={'create-copy-button'}
							sx={{
								[theme.breakpoints.up('md')]: {
									display: 'none',
								},
							}}
						>
							<CreateCopyButton variantGuid={props.variant.guid} asMenuItem />
						</Box>
					),
					// <Box
					// 	key={'add-to-playlist-menu-item'}
					// 	sx={{
					// 		[theme.breakpoints.up('sm')]: {
					// 			display: 'none',
					// 		},
					// 	}}
					// >
					// 	<AddToPlaylistButton variant={props.variant} asMenuItem />
					// </Box>,

					isTrustee() && [
						<Divider key={'divider1'} />,
						<PublishButton variant={props.variant} key={'publish-button-as'} />,
					],
				]} */}

				{/* <AddToGroupButton
					packGuid={props.variant.packGuid}
					key={'add-to-group-button'}
				/> */}

				{props.isOwner && [
					<Divider key={'div-aunalk'} />,
					<DeleteButton
						key={'delete-button'}
						reloadSong={props.reloadSong}
						variant={props.variant}
						asMenuItem
					/>,
				]}
			</Menu>

			<SheetAdminButtons
				key={'sheet-admin-buttons'}
				sheet={props.sheet}
				song={props.song}
				reload={props.reloadSong}
				variant={props.variant}
				onEditClick={props.onEditClick}
				isInEditMode={props.isInEditMode}
				editLoading={props.saving}
				editedTitle={props.editedTitle}
				anyChange={props.anyChange}
			/>
		</>
	)
}
