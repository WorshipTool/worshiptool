import { CircularProgress } from '@/common/ui'
import { ListItemIcon, ListItemText, MenuItem } from '@/common/ui/mui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
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
		fetchApiState(
			() => {
				return (
					songPublishingApi.songPublishingControllerUnpublishVariant({
						packGuid: props.variant.packGuid,
					})
				)
			},
			() => {
				reload()
				enqueueSnackbar(`Zveřejnění písně ${props.variant.title} bylo zrušeno`)
			}
		)
	}
	const verify = () => {
		navigate('variantPublish', parseVariantAlias(props.variant.packAlias))
	}

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
