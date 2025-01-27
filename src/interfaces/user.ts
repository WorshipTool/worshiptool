export type UserGuid = string & { readonly brand: unique symbol }

export enum ROLES {
	'User',
	'Trustee',
	'Loader',
	'Admin',
}




export enum LOGIN_METHOD_TYPE {
	'Email' = 0,
	'Google' = 1,
}

export type UserDto = {
	guid: UserGuid
	firstName: string
	lastName: string
	email: string
	role: ROLES
	token: string
	loginMethods: LOGIN_METHOD_TYPE[]
	pictureUrl?: string
}
