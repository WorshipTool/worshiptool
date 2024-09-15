export enum TeamMemberRole {
	MEMBER,
	MANAGER,
}
export type TeamPermissions = {
	'team.kick_member': {
		teamGuid: string
	}
	'team.set_member_role': {
		teamGuid: string
	}
	'team.add_song': {
		teamGuid: string
	}
	'team.remove_song': {
		teamGuid: string
	}
	'team.change_base_info': {
		teamGuid: string
	}
}
