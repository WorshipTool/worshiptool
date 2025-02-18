import VerifyButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/VerifyButton'
import AdminOption from '@/common/components/admin/AdminOption'
import CustomMenuItem from '@/common/components/Menu/MenuItem'
import Popup from '@/common/components/Popup/Popup'
import { Button, Divider, Typography, useTheme } from '@/common/ui'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@/common/ui/mui'
import { ExtendedVariantPack } from '@/types/song'
import {
	CopyAll,
	NewReleases,
	Tag,
	Verified,
	VerifiedUser,
	VideoFile,
} from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { SongDto } from '../../../../../../../api/dtos'
import useAuth from '../../../../../../../hooks/auth/useAuth'
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'
import PublishButton from './PublishButton'

interface AddToPlaylistButtonProps {
	sheet: Sheet
	song: SongDto
	reload: () => void
	variant: ExtendedVariantPack
	onEditClick: (editable: boolean) => void
	isInEditMode?: boolean
	editLoading: boolean
	editedTitle: string
	anyChange: boolean
}

export default function SheetAdminButtons({
	sheet,
	song,
	reload,
	variant,
	onEditClick,
	isInEditMode,
	editLoading,
	editedTitle,
	anyChange,
}: AddToPlaylistButtonProps) {
	const { isAdmin, user, apiConfiguration } = useAuth()

	const [open, setOpen] = React.useState(false)

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: any) => {
		setOpen(true)
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setOpen(false)
		setAnchorEl(null)
	}

	const { enqueueSnackbar } = useSnackbar()

	const [addVideoOpen, setAddVideoOpen] = useState(false)
	const [addTagOpen, setAddTagOpen] = useState(false)
	const [addCreatorOpen, setAddCreatorOpen] = useState(false)

	const onCopyClick = () => {
		navigator.clipboard.writeText(sheet?.getOriginalSheetData() || '')
		enqueueSnackbar('Data písně byla zkopírována do schránky')
	}

	const addCreator = () => {
		setAddCreatorOpen(true)
		handleClose()
	}

	const addVideo = () => {
		setAddVideoOpen(true)
		handleClose()
	}

	const addTag = () => {
		setAddTagOpen(true)
		handleClose()
	}

	const theme = useTheme()

	const [verifyPopupOpen, setVerifyPopupOpen] = useState(false)
	return (
		<>
			<AdminOption
				title="Pokročilé možnosti"
				subtitle="Možnosti k písni"
				onClick={handleClick}
			/>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={open}
				onClose={handleClose}
			>
				<PublishButton variant={variant} />
				{variant.public && (
					<CustomMenuItem
						title="Spravovat manuální ověření"
						icon={variant.verified ? <Verified /> : <NewReleases />}
						onClick={() => setVerifyPopupOpen(true)}
					/>
				)}
				<Divider />

				{isAdmin() &&
					variant.createdByLoader && [
						<EditButton
							key={'edit-button'}
							asMenuItem
							onClick={onEditClick}
							inEditMode={isInEditMode}
							loading={editLoading}
							sheetData={sheet?.getOriginalSheetData() || ''}
							title={editedTitle}
							anyChange={anyChange}
						/>,
						<DeleteButton
							reloadSong={reload}
							variant={variant}
							asMenuItem
							key={'delete-button'}
						/>,

						<Divider key={'divider'} />,
					]}

				<MenuItem onClick={onCopyClick}>
					<ListItemIcon>
						<CopyAll fontSize="small" />
					</ListItemIcon>
					<ListItemText>Zkopírovat</ListItemText>
				</MenuItem>

				<MenuItem onClick={addCreator}>
					<ListItemIcon>
						<VerifiedUser fontSize="small" />
					</ListItemIcon>
					<ListItemText>Přidat autora</ListItemText>
				</MenuItem>

				<MenuItem onClick={addVideo}>
					<ListItemIcon>
						<VideoFile fontSize="small" />
					</ListItemIcon>
					<ListItemText>Přidat video</ListItemText>
				</MenuItem>

				<MenuItem onClick={addTag}>
					<ListItemIcon>
						<Tag fontSize="small" />
					</ListItemIcon>
					<ListItemText>Přidat tag</ListItemText>
				</MenuItem>
			</Menu>

			<Popup
				open={verifyPopupOpen}
				onClose={() => setVerifyPopupOpen(false)}
				title="Manuální ověření"
				subtitle={variant.title}
				actions={[
					<Button key={'cancel'} type="reset" size="small" variant="text">
						Zrušit
					</Button>,
					<VerifyButton variant={variant} key={'action'} />,
				]}
				width={300}
			>
				{variant.verified !== null ? (
					<>
						{variant.verified ? (
							<Typography>Píseň je manualně ověřena.</Typography>
						) : (
							<Typography>Píseň je manualně zamítnuta.</Typography>
						)}
					</>
				) : (
					<>
						<Typography>Píseň není manualně ověřena</Typography>
					</>
				)}
			</Popup>
		</>
	)
}
