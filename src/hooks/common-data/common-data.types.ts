import { PackGuid } from '@/api/dtos'
import { AllTeamSubdomainAlias, TeamOfUserDto } from '@/api/generated'

export type AllCommonData = {
	translationLikes: TranslationLike[]
	teamsOfUser: TeamOfUserDto[]
	// playlistsOfUser: PlaylistData[]
	// permissionsOfUser: UntypedPermissionDataType
	allsubdomains: AllTeamSubdomainAlias[]
	// favourites: GetFavouritesOutDto
}

export type TranslationLike = {
	packGuid: PackGuid
}
