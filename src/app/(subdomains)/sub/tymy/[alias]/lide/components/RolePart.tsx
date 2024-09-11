import { Box, Chip, MenuItem, Select } from '@mui/material'

export enum TeamMemberRole {
	ADMIN,
	MEMBER,
}

export const teamMemberRoles = {
	[TeamMemberRole.ADMIN]: 'Správce',
	[TeamMemberRole.MEMBER]: 'Uživatel',
}

type RolePartProps = {
	editable?: boolean
	role: TeamMemberRole
	onRoleChange: (role: TeamMemberRole) => void
}

export default function RolePart({
	editable = false,
	role,
	onRoleChange: setRole,
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
					<Chip label={teamMemberRoles[role]} color="default" />
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
