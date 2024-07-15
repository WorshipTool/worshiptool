import { UserDto, UserGuid } from '../../interfaces/user'
import { LoginResult } from '../generated'

export interface LoginRequestDTO {
	email: string
	password: string
}

export interface LoginResultDTO {
	user: UserDto
	token: string
}

export interface SignUpRequestDTO {
	firstName: string
	lastName: string
	email: string
	password: string
}

export function loginResultDTOToUser(res: LoginResult): UserDto {
	return { ...res.user, guid: res.user.guid as UserGuid, token: res.token }
}

export interface PostLoginGoogleDto {
	userToken: string
	email: string
	firstName: string
	lastName: string
}
