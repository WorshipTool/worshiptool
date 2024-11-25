import { Box, Button, IconButton, Typography } from '@/common/ui'
import { NativeSelect } from '@/common/ui/mui'
import { Close } from '@mui/icons-material'
import { useState } from 'react'
import { permissionPayloadToApi } from '../../../../../../../api/dtos/permission'
import { useApi } from '../../../../../../../hooks/api/useApi'
import {
	PermissionDataType,
	PermissionType,
	PermissionsTypes,
} from '../../../../../../../hooks/permissions/permission.types'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'
import PermissionItemPayload from './PermissionItemPayload'

type PermissionItemProps<T extends PermissionType> = {
	permission: PermissionDataType<PermissionsTypes, T>
	editable?: boolean
	onSubmit?: () => void
	userGuid: string
}

export default function PermissionItem<T extends PermissionType>(
	props: PermissionItemProps<T>
) {
	const [type, setType] = useState(props.permission.type)
	const [payload, setPayload] = useState(props.permission.payload)

	const { permissionApi } = useApi()

	const onSubmit = async () => {
		const permission = await handleApiCall(
			permissionApi.permissionControllerGetOrAddPermission({
				type: type,
				payload: permissionPayloadToApi(payload),
			})
		)

		await permissionApi.permissionControllerAddPermissionToUser({
			userGuid: props.userGuid,
			permissionGuid: permission.guid,
		})

		props.onSubmit?.()
	}

	const onRemove = async () => {
		await handleApiCall(
			permissionApi.permissionControllerRemovePermissionFromUser({
				userGuid: props.userGuid,
				permissionGuid: props.permission.guid as string,
			})
		)
		props.onSubmit?.()
	}

	return (
		<Box
			sx={{
				borderRadius: 1,
				border: props.editable ? 1 : 0,
				borderColor: 'grey.300',
				padding: 1,
				backgroundColor: props.editable ? 'grey.100' : 'transparent',
			}}
		>
			{props.editable ? (
				<>
					<NativeSelect
						defaultValue={type}
						inputProps={{
							name: 'type',
							id: 'type',
						}}
						onChange={(e) => {
							setType(e.target.value as T)
						}}
					>
						{Object.values(Permissions).map((p) => (
							<option value={p} key={p}>
								{p}
							</option>
						))}
					</NativeSelect>
					<PermissionItemPayload type={type} editable onChange={setPayload} />
					<Button
						color="success"
						variant="contained"
						size="small"
						onClick={onSubmit}
					>
						Přidat
					</Button>
				</>
			) : (
				<Box display={'flex'} flexDirection={'row'}>
					<Box flex={1}>
						<Box display={'flex'} flexDirection={'row'} gap={1}>
							<Typography>
								<b>Typ</b>
							</Typography>
							<Typography>{props.permission.type}</Typography>
						</Box>

						<PermissionItemPayload
							type={type}
							value={props.permission.payload}
						/>
					</Box>

					<IconButton size="large" color="error" onClick={onRemove}>
						<Close />
					</IconButton>
				</Box>
			)}
		</Box>
	)
}
