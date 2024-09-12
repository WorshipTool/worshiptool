// export const Permissions: Record<keyof PermissionPayloads, string> = {
// 	GROUP_ADD_SONG: 'GROUP_ADD_SONG',
// 	GROUP_REMOVE_SONG: 'GROUP_REMOVE_SONG',
// 	GROUP_OWNER: 'GROUP_OWNER',
// }

// export type PermissionPayloads = {
// 	GROUP_ADD_SONG: string
// 	GROUP_REMOVE_SONG: string
// 	GROUP_OWNER: string
// }

export type PermissionsTypes = Record<string, any>
export type PermissionType<A extends PermissionsTypes> = Extract<
	keyof A,
	string
>
export type PermissionPayloadType<
	A extends PermissionsTypes,
	T extends PermissionType<A> = PermissionType<A>
> = A[T]

export type PermissionDataType<
	A extends PermissionsTypes,
	T extends PermissionType<A>
> = {
	type: T
	payload?: PermissionPayloadType<A, T>
	guid?: string
}
