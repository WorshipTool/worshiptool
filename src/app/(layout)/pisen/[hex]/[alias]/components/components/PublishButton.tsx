import { parseVariantAlias } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { handleApiCall } from '@/tech/handleApiCall'
import { Public, PublicOff } from '@mui/icons-material'
import {
	CircularProgress,
	ListItemIcon,
	ListItemText,
	MenuItem,
	useTheme,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { SongVariantDto } from '../../../../../../../api/dtos'
import { useApi } from '../../../../../../../hooks/api/useApi'
import { useApiState } from '../../../../../../../tech/ApiState'

export interface PublishButtonProps {
	variant: SongVariantDto
}

export default function PublishButton(props: PublishButtonProps) {
	const { songEditingApi, songPublishingApi } = useApi()
	const {
		fetchApiState,
		apiState: { loading },
	} = useApiState()

	const navigate = useSmartNavigate()

	const { enqueueSnackbar } = useSnackbar()

	// const [loading, setLoading] = React.useState(false);

	const reload = () => {
		// props.reloadSong()
		window.location.reload()
	}

	const unverify = () => {
		// fetchApiState(
		// 	async () => {
		// 		return handleApiCall(
		// 			songEditingApi.songEditingControllerUnverify(props.variant.guid)
		// 		)
		// 	},
		// 	() => {
		// 		reload()
		// 		enqueueSnackbar(
		// 			`Zveřejnění písně ${
		// 				(props.variant.preferredTitle && ' ') || ''
		// 			}bylo zrušeno`
		// 		)
		// 	}
		// )
		fetchApiState(
			() => {
				return handleApiCall(
					songPublishingApi.songPublishingControllerUnpublishVariant({
						variantGuid: props.variant.guid,
					})
				)
			},
			() => {
				reload()
				enqueueSnackbar(
					`Zveřejnění písně ${props.variant.preferredTitle} bylo zrušeno`
				)
			}
		)
	}
	const verify = () => {
		// fetchApiState(
		// 	async () => {
		// 		return handleApiCall(
		// 			songEditingApi.songEditingControllerVerify(props.variant.guid)
		// 		)
		// 	},
		// 	() => {
		// 		reload()
		// 		enqueueSnackbar(
		// 			`Píseň ${(props.variant.preferredTitle && ' ') || ''}byla zveřejněna.`
		// 		)
		// 	}
		// )
		navigate('variantPublish', parseVariantAlias(props.variant.alias))
	}

	const theme = useTheme()

	return (
		<MenuItem
			onClick={() => {
				if (props.variant.public) {
					unverify()
				} else {
					verify()
				}
			}}
			disabled={loading}
		>
			<ListItemIcon>
				{loading ? (
					<CircularProgress size={24} color="inherit" />
				) : props.variant.public ? (
					<PublicOff />
				) : (
					<Public />
				)}
			</ListItemIcon>
			<ListItemText
				primary={props.variant.public ? 'Zrušit zveřejnění' : 'Zveřejnit'}
			/>
		</MenuItem>
	)
}
