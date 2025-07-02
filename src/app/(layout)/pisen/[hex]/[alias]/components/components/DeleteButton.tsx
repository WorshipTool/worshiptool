import { useApi } from '@/api/tech-and-hooks/useApi'
import Popup from '@/common/components/Popup/Popup'
import { Button, CircularProgress } from '@/common/ui'
import { ListItemIcon, ListItemText, MenuItem } from '@/common/ui/mui'
import { Typography } from '@/common/ui/Typography'
import { ExtendedVariantPack } from '@/types/song'
import { Delete } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useApiState } from '../../../../../../../tech/ApiState'

interface DeleteButtonProps {
	variant: ExtendedVariantPack
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

	const { songDeletingApi } = useApi()

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
				return songDeletingApi._delete(variant.packGuid)
			},
			(result) => {
				enqueueSnackbar(`Píseň ${(variant.title && ' ') || ''}byla smazána.`)
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
				<Button
					variant="contained"
					color={'error'}
					// startIcon={<Remove/>}
					loading={loading}
					// loadingIndicator="Mazání..."
					onClick={async () => {
						onClick()
					}}
					disabled={variant.deleted}
				>
					{variant.deleted ? 'Smazáno' : 'Smazat'}
				</Button>
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
						<Button
							loading={fetching}
							variant="contained"
							color="error"
							onClick={yesClick}
						>
							Ano
						</Button>
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
