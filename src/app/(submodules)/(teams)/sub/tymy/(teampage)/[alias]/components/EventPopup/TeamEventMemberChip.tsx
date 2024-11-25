import { TeamEventMemberData } from '@/api/generated'
import { Avatar, Chip } from '@/common/ui/mui'
import { useUserProfileImage } from '@/hooks/useUserProfileImage'

type TeamEventMemberChipProps = {
	member: TeamEventMemberData
	editable?: boolean
	onMemberRemove: (member: TeamEventMemberData) => any
}

export default function TeamEventMemberChip({
	member,
	editable,
	onMemberRemove,
}: TeamEventMemberChipProps) {
	const profileImage = useUserProfileImage(member.userGuid)
	return (
		<Chip
			key={member.userGuid}
			avatar={<Avatar src={profileImage} />}
			label={member.firstName + ' ' + member.lastName}
			// size="small"
			onDelete={editable ? () => onMemberRemove(member) : undefined}
			onClick={() => {}}
		/>
	)
}
