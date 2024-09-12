import { TeamMemberDto } from '@/api/generated'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(subdomains)/sub/tymy/tech'
import { IconButton } from '@/common/ui/IconButton'
import { usePermission } from '@/hooks/permissions/usePermission'
import { Done, Edit, PersonRemove } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'

type RightSideItemProps = {
	data: TeamMemberDto
	editable: boolean
	onEditableChange: (editable: boolean) => void
	selectable: boolean
	onRemove: () => void
}

export default function ActionsPartPeople(props: RightSideItemProps) {
	const onEditClick = () => {
		props.onEditableChange(true)
	}

	const { enqueueSnackbar } = useSnackbar()
	const onDoneClick = () => {
		props.onEditableChange(false)
		enqueueSnackbar('Role byla nastavena')
	}
	const { guid: teamGuid } = useInnerTeam()
	const kickPermission = usePermission<TeamPermissions>('team.kick_member', {
		teamGuid: teamGuid,
	})
	const setRolePermission = usePermission<TeamPermissions>(
		'team.set_member_role',
		{
			teamGuid: teamGuid,
		}
	)
	return (
		<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
			{props.editable ? (
				<>
					<IconButton
						onClick={onDoneClick}
						color="success"
						tooltip="Uložit roli"
					>
						<Done />
					</IconButton>
				</>
			) : (
				<IconButton
					onClick={onEditClick}
					disabled={props.selectable || !setRolePermission}
					tooltip="Změnit roli"
				>
					<Edit />
				</IconButton>
			)}
			{
				<IconButton
					disabled={props.selectable || !kickPermission}
					onClick={props.onRemove}
					tooltip="Odebrat z týmu"
				>
					<PersonRemove />
				</IconButton>
			}
		</Box>
	)
}
