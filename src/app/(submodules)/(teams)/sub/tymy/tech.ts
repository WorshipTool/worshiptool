export enum TeamMemberRole {
	MEMBER,
	MANAGER,
}

export type TeamGuid = string & { readonly brand: unique symbol }

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
	'team.edit_songs': {
		teamGuid: string
	}

	'team.add_event': {
		teamGuid: string
	}

	'team.delete_event': {
		eventGuid: string
	}

	'team.edit_event': {
		eventGuid: string
	}

	'team.pin_playlist': {
		teamGuid: string
	}
	'team.unpin_playlist': {
		teamGuid: string
	}
	'team.edit_song_note': {
		teamGuid: string
	}
}
