import { TeamMemberDto } from '@/api/generated'
import ActionsPartPeople from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/ActionsPartPeople'
import RolePart, {
	TeamMemberRole,
} from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/RolePart'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { UserGuid } from '@/interfaces/user'
import { ExitToApp } from '@mui/icons-material'
import { Avatar, Box, Checkbox } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'

type PeopleListItemProps = {
	data: TeamMemberDto
	selectable?: boolean
	me?: boolean
	selected: boolean
	onSelectChange: (selected: boolean) => void
	onMemberRemove: (guid: UserGuid) => void
	onChangeRole: (guid: UserGuid, role: TeamMemberRole) => void
}

export default function PeopleListItem(props: PeopleListItemProps) {
	const fullName = `${props.data.firstName} ${props.data.lastName}`
	const [_editable, setEditable] = useState(false)

	const [role, setRole] = useState<TeamMemberRole>(TeamMemberRole.MEMBER)

	useEffect(() => {
		if (props.selectable) {
			setEditable(false)
		}
	}, [props.selectable])

	const editable = useMemo(() => {
		return _editable && !props.me && !props.selectable
	}, [_editable, props.me, props.selectable])

	const onRemove = useCallback(() => {
		props.onMemberRemove(props.data.guid as UserGuid)
	}, [])

	const onEditableChange = useCallback(
		(editable: boolean) => {
			setEditable(editable)
			if (!editable) {
				props.onChangeRole(props.data.guid as UserGuid, role)
			}
		},
		[role, props.data]
	)

	return (
		<>
			{props.selectable && (
				<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
					<Checkbox
						size="small"
						checked={props.selected}
						onChange={(e) => {
							props.onSelectChange(e.target.checked)
						}}
					/>
				</Box>
			)}
			<Box>
				<Avatar />
			</Box>
			<Box>
				<Typography>{fullName}</Typography>
			</Box>
			<Box>
				<Typography>{props.data.email}</Typography>
			</Box>
			<RolePart editable={editable} role={role} onRoleChange={setRole} />
			<Box></Box>
			{!props.me ? (
				<ActionsPartPeople
					data={props.data}
					editable={editable}
					onEditableChange={onEditableChange}
					selectable={Boolean(props.selectable)}
					onRemove={onRemove}
				/>
			) : (
				<Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
					<Button
						tooltip="Opustit tým"
						color="error"
						size="small"
						variant="outlined"
						endIcon={<ExitToApp />}
						disabled={props.selectable}
						onClick={onRemove}
					>
						Odejít
					</Button>
				</Box>
			)}
		</>
	)
}
