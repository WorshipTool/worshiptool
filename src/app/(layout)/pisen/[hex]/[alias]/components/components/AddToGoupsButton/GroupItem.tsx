import { VariantPackGuid } from '@/api/dtos'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { CheckCircle, PlaylistAdd } from '@mui/icons-material'
import {
	CircularProgress,
	ListItemIcon,
	ListItemText,
	MenuItem,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { SkeletonLoader } from '../../../../../../../../common/providers'
import { useGroups } from '../../../../../../../../hooks/group/useGroups'
import usePlaylistsGeneral from '../../../../../../../../hooks/playlist/usePlaylistsGeneral'
import {
	useApiState,
	useApiStateEffect,
} from '../../../../../../../../tech/ApiState'

type GroupItemProps = {
	groupGuid: string
	packGuid: VariantPackGuid
	addable: boolean
	removable: boolean
}
export default function GroupItem(props: GroupItemProps) {
	const groups = useGroups()
	const [groupState] = useApiStateEffect(async () => {
		return groups.getInfoByGuid(props.groupGuid)
	}, [props.groupGuid])

	const selection = usePlaylistsGeneral()

	const [isInState, reload] = useApiStateEffect(async () => {
		if (!groupState.data?.selection) return false
		return selection.isVariantInPlaylist(
			props.packGuid,
			groupState.data?.selection as PlaylistGuid
		)
	}, [groupState])

	const { enqueueSnackbar } = useSnackbar()

	const { apiState: addingState, fetchApiState } = useApiState()

	const addToSelection = () => {
		fetchApiState(() =>
			selection
				.addVariantToPlaylist(
					props.packGuid,
					groupState.data?.selection as PlaylistGuid
				)
				.then(() => {
					reload()
					enqueueSnackbar('Přidáno do skupiny')
				})
		)
	}

	const removeFromSelection = () => {
		fetchApiState(() =>
			selection
				.removeVariantFromPlaylist(
					props.packGuid,
					groupState.data?.selection as PlaylistGuid
				)
				.then(() => {
					reload()
					enqueueSnackbar('Odebráno ze skupiny')
				})
		)
	}

	const handleClick = () => {
		if (!groupState.data) return
		if (isInState.data) {
			if (props.removable) removeFromSelection()
		} else {
			if (props.addable) addToSelection()
		}
	}

	return (
		<MenuItem
			onClick={handleClick}
			disabled={
				(isInState.data && !props.removable) ||
				(!isInState.data && !props.addable)
			}
		>
			<SkeletonLoader
				data={[groupState, isInState]}
				render={() => {
					return (
						<>
							<ListItemIcon>
								{addingState.loading ? (
									<CircularProgress size={'1rem'} color="inherit" />
								) : !isInState.data ? (
									<PlaylistAdd fontSize="small" />
								) : (
									<CheckCircle fontSize="small" />
								)}
							</ListItemIcon>
							<ListItemText primary={groupState.data?.name} />
						</>
					)
				}}
				renderLoading={() => {
					return <CircularProgress size={'1rem'} color="inherit" />
				}}
			/>
		</MenuItem>
	)
}
