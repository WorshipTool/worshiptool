import { Restore } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { SongVariantDto } from '../../../../../../../api/dtos'
import { SongDeletingApi } from '../../../../../../../api/generated'
import { Gap } from '../../../../../../../common/ui/Gap'
import useAuth from '../../../../../../../hooks/auth/useAuth'
import { useApiState } from '../../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'

interface DeletedInfoPanelProps {
	variant: SongVariantDto
	reloadSong: () => void
}

export default function DeletedInfoPanel({
	variant,
	reloadSong,
}: DeletedInfoPanelProps) {
	const { isAdmin, apiConfiguration } = useAuth()
	const { enqueueSnackbar } = useSnackbar()

	const songsApi = new SongDeletingApi(apiConfiguration)
	const {
		fetchApiState,
		apiState: { loading },
	} = useApiState()
	const restore = () => {
		fetchApiState(
			async () => {
				return handleApiCall(
					songsApi.songDeletingControllerRestore(variant.packGuid)
				)
			},
			() => {
				enqueueSnackbar(
					`Píseň ${(variant.preferredTitle && ' ') || ''}byla obnovena.`
				)
				reloadSong?.()
			}
		)
	}
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<Typography color="error">Tato píseň byla smazána.</Typography>
			<Gap value={2} horizontal />
			{isAdmin() && (
				<>
					<LoadingButton
						variant="contained"
						color="secondary"
						startIcon={<Restore />}
						loadingIndicator="Obnovování..."
						loading={loading}
						onClick={restore}
					>
						Obnovit
					</LoadingButton>
				</>
			)}
		</Box>
	)
}
