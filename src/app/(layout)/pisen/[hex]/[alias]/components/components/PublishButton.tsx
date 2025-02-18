import { CircularProgress, useTheme } from '@/common/ui'
import { ListItemIcon, ListItemText, MenuItem } from '@/common/ui/mui'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { BasicVariantPack } from '@/types/song'
import { Public, PublicOff } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useApi } from '../../../../../../../hooks/api/useApi'
import { useApiState } from '../../../../../../../tech/ApiState'

export interface PublishButtonProps {
	variant: BasicVariantPack
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
		// 	() => {
		// 		return handleApiCall(
		// 			songPublishingApi.songPublishingControllerUnpublishVariant({
		// 				variantGuid: props.variant.guid,
		// 			})
		// 		)
		// 	},
		// 	() => {
		// 		reload()
		// 		enqueueSnackbar(
		// 			`Zveřejnění písně ${props.variant.preferredTitle} bylo zrušeno`
		// 		)
		// 	}
		// )
		//TODO
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
		navigate('variantPublish', parseVariantAlias(props.variant.packAlias))
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
