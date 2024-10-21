import { JwtResult } from '@/api/generated'
import { getImageUrl } from '@/api/urls'
import { UserDto, UserGuid } from '../../interfaces/user'

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

export function loginResultDTOToUser(res: JwtResult): UserDto {
	const pictureUrl = getImageUrl(res.user.pictureGuid)
	return {
		...res.user,
		guid: res.user.guid as UserGuid,
		token: res.token,
		// pictureUrl: pictureUrl || undefined,
	}
}
