import { useMemo } from 'react'
import {
	PermissionPayloadType,
	PermissionType,
	PermissionsTypes,
} from './permission.types'
import { usePermissions } from './usePermissions'

export const usePermission = <A extends PermissionsTypes>(
	type: PermissionType<A>,
	payload: PermissionPayloadType<A, PermissionType<A>>
): boolean | null => {
	const data = usePermissions()
	const includes = useMemo(() => {
		return data.state.loading ? null : data.includesPermission(type, payload)
	}, [data, type, payload])
	return includes
}
