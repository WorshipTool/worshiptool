import { createContext, useContext } from 'react'
import {
	apiToPermissionPayload,
	permissionPayloadToApi,
} from '../../api/dtos/permission'
import { useApiStateEffect } from '../../tech/ApiState'
import { handleApiCall } from '../../tech/handleApiCall'
import { useApi } from '../api/useApi'
import useAuth from '../auth/useAuth'
import {
	PermissionDataType,
	PermissionPayloadType,
	PermissionType,
	PermissionsTypes,
} from './permission.types'

type Merge<T extends PermissionsTypes[]> = T extends [
	infer First,
	...infer Rest
]
	? First & Merge<Rest extends Record<string, any>[] ? Rest : []>
	: {}

// type Merge<T extends Record<string, any>> = T

type Rt = ReturnType<typeof useProvidePermissions>

const permissionsContext = createContext<Rt>({
	notInitialized: true,
} as Rt)

export const usePermissions = () => {
	const d = useContext(permissionsContext)
	if (d.notInitialized) {
		throw new Error('usePermissions must be used inside PermissionsProvider')
	}
	return d
}

export const PermissionsProvider = ({ children }: { children: any }) => {
	const p = useProvidePermissions()

	if (!p) {
		throw new Error(
			'PermissionsProvider must be used inside PermissionsProvider'
		)
	}

	return (
		<permissionsContext.Provider value={p}>
			{children}
		</permissionsContext.Provider>
	)
}

function useProvidePermissions<
	A extends PermissionsTypes[] = [PermissionsTypes]
>(userGuid?: string) {
	const { permissionApi } = useApi()
	const { user, isAdmin, isLoggedIn } = useAuth()
	const [state, reload] = useApiStateEffect<
		PermissionDataType<Merge<A>, PermissionType<Merge<A>>>[]
	>(async () => {
		if (!isLoggedIn()) return []
		const data = await handleApiCall(
			permissionApi.permissionControllerGetUserPermissions(userGuid)
		)
		return data.map((p) => {
			return {
				type: p.type as PermissionType<Merge<A>>,
				payload: apiToPermissionPayload(p.payload),
				guid: p.guid,
			}
		})
	}, [userGuid, isLoggedIn])

	const getUsersWithPermission = async <T extends PermissionType<Merge<A>>>(
		type: T,
		payload: PermissionPayloadType<Merge<A>, T>
	) => {
		if (!isLoggedIn()) return []
		const data = await handleApiCall(
			permissionApi.permissionControllerGetAllUsersWithPermission(
				type,
				permissionPayloadToApi(payload)
			)
		)
		return data
	}

	return {
		reload,
		state: state,
		permissions: state.data || [],
		getUsersWithPermission,
		includesPermission: <T extends PermissionType<Merge<A>>>(
			type: T,
			payload?: PermissionPayloadType<Merge<A>, T>
		) => {
			if ((!userGuid || user?.guid === userGuid) && isAdmin()) return true

			return (
				state.data?.some(
					(p) =>
						p.type === type &&
						(!payload || JSON.stringify(p.payload) === JSON.stringify(payload))
				) || false
			)
		},
	}
}
