import { TeamMemberRole } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { Box } from '@/common/ui'
import { Chip, MenuItem, Select } from '@/common/ui/mui'

export const teamMemberRoles = {
	[TeamMemberRole.MANAGER]: 'Správce',
	[TeamMemberRole.MEMBER]: 'Uživatel',
}

type RolePartProps = {
	editable?: boolean
	role: TeamMemberRole
	onRoleChange: (role: TeamMemberRole) => void
	isOwner: boolean
}

export default function RolePart({
	editable = false,
	role,
	onRoleChange: setRole,
	isOwner,
}: RolePartProps) {
	return (
		<>
			{editable ? (
				<Select
					value={role}
					onChange={(e) => {
						setRole(e.target.value as TeamMemberRole)
					}}
					size="small"
					fullWidth
				>
					{Object.entries(teamMemberRoles).map(([key, value]) => (
						<MenuItem key={key} value={key}>
							{value}
						</MenuItem>
					))}
				</Select>
			) : (
				<Box display={'flex'} flexDirection={'row'}>
					<Chip
						label={isOwner ? 'Vlastník' : teamMemberRoles[role]}
						color="default"
					/>
				</Box>
				// <Box
				// 	sx={{
				// 		bgcolor: 'grey.200',
				// 		border: '1px solid',
				// 		borderColor: 'grey.300',
				// 		borderRadius: 2,
				// 		paddingX: 1,
				// 		paddingY: 0.5,
				// 	}}
				// >

				// 	<Typography color="grey.700">{teamMemberRoles[role]}</Typography>
				// </Box>
			)}
		</>
	)
}
