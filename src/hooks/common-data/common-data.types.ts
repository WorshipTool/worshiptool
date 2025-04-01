import { PackGuid } from '@/api/dtos'
import {
	AllTeamSubdomainAlias,
	GetFavouritesOutDto,
	PlaylistData,
	TeamOfUserDto,
} from '@/api/generated'
import { UntypedPermissionDataType } from '@/hooks/permissions/permission.types'

export type AllCommonData = {
	translationLikes: TranslationLike[]
	teamsOfUser: TeamOfUserDto[]
	playlistsOfUser: PlaylistData[]
	permissionsOfUser: UntypedPermissionDataType
	allsubdomains: AllTeamSubdomainAlias[]
	favourites: GetFavouritesOutDto
}

export type TranslationLike = {
	packGuid: PackGuid
}
