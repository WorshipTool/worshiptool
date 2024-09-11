import { TeamMemberDto } from '@/api/generated'
import { Done, Edit, PersonRemove } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

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

	const onDoneClick = () => {
		props.onEditableChange(false)
	}

	return (
		<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
			{props.editable ? (
				<>
					<IconButton onClick={onDoneClick} color="success">
						<Done />
					</IconButton>
				</>
			) : (
				<IconButton onClick={onEditClick} disabled={props.selectable}>
					<Edit />
				</IconButton>
			)}
			{
				<IconButton disabled={props.selectable} onClick={props.onRemove}>
					<PersonRemove />
				</IconButton>
			}
		</Box>
	)
}
