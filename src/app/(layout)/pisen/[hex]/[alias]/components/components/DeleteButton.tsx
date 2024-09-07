import Popup from '@/common/components/Popup/Popup'
import { Typography } from '@/common/ui/Typography'
import { Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Button,
	CircularProgress,
	ListItemIcon,
	ListItemText,
	MenuItem,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { SongVariantDto } from '../../../../../../../api/dtos'
import { SongDeletingApi } from '../../../../../../../api/generated'
import useAuth from '../../../../../../../hooks/auth/useAuth'
import { useApiState } from '../../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'

interface DeleteButtonProps {
	variant: SongVariantDto
	reloadSong?: () => void
	asMenuItem?: boolean
}

export default function DeleteButton({
	variant,
	reloadSong,
	asMenuItem,
}: DeleteButtonProps) {
	const { enqueueSnackbar } = useSnackbar()
	const [loading, setLoading] = React.useState(false)
	const navigate = useRouter()

	const { apiConfiguration } = useAuth()
	const songsApi = new SongDeletingApi(apiConfiguration)

	const {
		fetchApiState,
		apiState: { loading: fetching },
	} = useApiState()

	const [dialogOpen, setDialogOpen] = React.useState(false)

	const onClick = async () => {
		if (variant.verified) {
			enqueueSnackbar('Nelze smazat veřejnou píseň.')
			return
		}

		setDialogOpen(true)
		setLoading(true)
	}

	const indeedDelete = async () => {
		fetchApiState(
			async () => {
				return handleApiCall(
					songsApi.songDeletingControllerDelete(variant.packGuid)
				)
			},
			(result) => {
				enqueueSnackbar(
					`Píseň ${(variant.preferredTitle && ' ') || ''}byla smazána.`
				)
				reloadSong?.()

				// back in history
				navigate.back()
				setDialogOpen(false)
			}
		)
	}

	const yesClick = () => {
		indeedDelete()
	}

	const noClick = () => {
		if (fetching) return
		setLoading(false)
		setDialogOpen(false)
	}

	return (
		<>
			{asMenuItem ? (
				loading ? (
					<MenuItem disabled>
						<ListItemIcon>
							<CircularProgress size={`1rem`} color="inherit" />
						</ListItemIcon>
						<ListItemText
							primary={'Odstraňování...'}
							secondary={'Odstranit píseň...'}
						/>
					</MenuItem>
				) : variant.deleted ? (
					<MenuItem>
						<ListItemText>Smazáno</ListItemText>
					</MenuItem>
				) : (
					<MenuItem
						onClick={onClick}
						sx={{
							color: 'error.main',
						}}
					>
						<ListItemIcon>
							<Delete color="error" />
						</ListItemIcon>
						<ListItemText primary={'Odstranit'} secondary={'Odstranit píseň'} />
					</MenuItem>
				)
			) : (
				<LoadingButton
					variant="contained"
					color={'error'}
					// startIcon={<Remove/>}
					loading={loading}
					loadingIndicator="Mazání..."
					onClick={async () => {
						onClick()
					}}
					disabled={variant.deleted}
				>
					{variant.deleted ? 'Smazáno' : 'Smazat'}
				</LoadingButton>
			)}

			<Popup
				open={dialogOpen}
				onClose={noClick}
				title={'Opravdu chcete smazat píseň?'}
				actions={
					<>
						<Button variant="outlined" onClick={noClick} disabled={fetching}>
							Ne
						</Button>
						<LoadingButton
							loading={fetching}
							variant="contained"
							color="error"
							onClick={yesClick}
						>
							Ano
						</LoadingButton>
					</>
				}
			>
				<Typography>
					{fetching
						? 'Probíhá odstraňování písně...'
						: 'Píseň se smaže natrvalo.'}
				</Typography>
			</Popup>
		</>
	)
}
