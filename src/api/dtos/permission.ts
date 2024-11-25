import { PermissionPayloadType } from '../../hooks/permissions/permission.types'

export const apiToPermissionPayload = (
	api?: string
): PermissionPayloadType<any> | undefined => {
	if (!api) return undefined

	try {
		return JSON.parse(api) as PermissionPayloadType<any>
	} catch (e) {
		return api as PermissionPayloadType<any>
	}
}

export const permissionPayloadToApi = (
	payload?: PermissionPayloadType<any>
): string | undefined => {
	if (!payload) return undefined
	return JSON.stringify(payload)
}
