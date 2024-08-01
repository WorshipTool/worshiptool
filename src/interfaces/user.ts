export type UserGuid = string & { readonly brand: unique symbol }

export enum ROLES {
	'User',
	'Trustee',
	'Loader',
	'Admin',
}

export type UserDto = {
	guid: UserGuid
	firstName: string
	lastName: string
	email: string
	role: ROLES
	token: string
}
