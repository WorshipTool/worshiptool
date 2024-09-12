import { Box, LinearProgress } from '@mui/material'
import { permissionPayloadToApi } from '../../../../../../api/dtos/permission'
import { useApi } from '../../../../../../hooks/api/useApi'
import {
	PermissionPayloadType,
	PermissionType,
} from '../../../../../../hooks/permissions/permission.types'
import { useApiState } from '../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../tech/handleApiCall'
import FoundUser from './FoundUser'

type AddUserItemProps<T extends PermissionType> = {
	permissionType: T
	permissionPayload: PermissionPayloadType<T>
	onAdd: () => void
	loading?: boolean
}

export default function AddUserItem<T extends PermissionType>(
	props: AddUserItemProps<T>
) {
	const { permissionApi } = useApi()
	const { apiState, fetchApiState } = useApiState()

	const onFoundUser = (userGuid: string) => {
		fetchApiState(
			async () => {
				const permission = await handleApiCall(
					permissionApi.permissionControllerGetOrAddPermission({
						type: props.permissionType,
						payload: permissionPayloadToApi(props.permissionPayload),
					})
				)

				return handleApiCall(
					permissionApi.permissionControllerAddPermissionToUser({
						userGuid: userGuid,
						permissionGuid: permission.guid,
					})
				)
			},
			() => {
				props.onAdd()
			}
		)
	}

	return (
		<Box>
			{props.loading ? <LinearProgress /> : <FoundUser onLoad={onFoundUser} />}
		</Box>
	)
}
