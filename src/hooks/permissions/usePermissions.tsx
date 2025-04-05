import { createContext, useContext, useEffect, useState } from 'react'
import {
	apiToPermissionPayload,
	permissionPayloadToApi,
} from '../../api/dtos/permission'
import { useApiState } from '../../tech/ApiState'
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

// Return type of useProvidePermissions
type Rt = ReturnType<typeof useProvidePermissions>

const permissionsContext = createContext<Rt>({
	notInitialized: true,
} as any as Rt)

export const usePermissions = (): Rt => {
	const d = useContext(permissionsContext)
	if ((d as any).notInitialized) {
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
	// const initialValue = useCommonData('permissionsOfUser')

	const [data, setData] = useState<
		PermissionDataType<Merge<A>, PermissionType<Merge<A>>>[]
	>([])

	const { permissionApi } = useApi()
	const { user, isAdmin, isLoggedIn } = useAuth()

	const { fetchApiState, apiState } =
		useApiState<PermissionDataType<Merge<A>, PermissionType<Merge<A>>>[]>()

	const reload = async () => {
		fetchApiState(async () => {
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
		})
			.then((r) => {
				if (r) setData(r)
			})
			.catch(() => {})
	}

	useEffect(() => {
		reload()
	}, [userGuid])

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
		state: apiState,
		permissions: data || [],
		getUsersWithPermission,
		includesPermission: <T extends PermissionType<Merge<A>>>(
			type: T,
			payload?: PermissionPayloadType<Merge<A>, T>
		) => {
			if ((!userGuid || user?.guid === userGuid) && isAdmin()) return true

			return (
				data?.some(
					(p) =>
						p.type === type &&
						(!payload || JSON.stringify(p.payload) === JSON.stringify(payload))
				) || false
			)
		},
	}
}
