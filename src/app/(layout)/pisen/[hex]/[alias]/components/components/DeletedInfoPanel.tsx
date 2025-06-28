import { Box, Button, Typography } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { BasicVariantPack } from '@/types/song'
import { Restore } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { Gap } from '../../../../../../../common/ui/Gap'
import useAuth from '../../../../../../../hooks/auth/useAuth'
import { useApiState } from '../../../../../../../tech/ApiState'

interface DeletedInfoPanelProps {
	variant: BasicVariantPack
	reloadSong: () => void
}

export default function DeletedInfoPanel({
	variant,
	reloadSong,
}: DeletedInfoPanelProps) {
	const { isAdmin, apiConfiguration } = useAuth()
	const { enqueueSnackbar } = useSnackbar()

	const { songDeletingApi } = useApi()
	const {
		fetchApiState,
		apiState: { loading },
	} = useApiState()
	const restore = () => {
		fetchApiState(
			async () => {
				return songDeletingApi.songDeletingControllerRestore(variant.packGuid)
			},
			() => {
				enqueueSnackbar(`Píseň ${(variant.title && ' ') || ''}byla obnovena.`)
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
					<Button
						variant="contained"
						color="secondary"
						startIcon={<Restore />}
						// loadingIndicator="Obnovování..."
						loading={loading}
						onClick={restore}
					>
						Obnovit
					</Button>
				</>
			)}
		</Box>
	)
}
