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
}
