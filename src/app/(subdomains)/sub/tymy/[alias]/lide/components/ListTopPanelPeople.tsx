import { TeamMemberRole } from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/RolePart'
import SelectedPeopleActions from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/SelectedPeopleActions'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { UserGuid } from '@/interfaces/user'
import { Box } from '@mui/material'

type ListTopPanelPeopleProps = {
	selectable: boolean
	selectedPeople: UserGuid[]
	onChange: (value: boolean) => void
	peopleCount?: number
	loading: boolean

	onMemberRemove: (guid: UserGuid) => void
	onRoleChange: (guid: UserGuid, role: TeamMemberRole) => void
}

export default function ListTopPanelPeople(props: ListTopPanelPeopleProps) {
	const onCancelClick = () => {
		props.onChange(false)
	}

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'space-between'}
			alignItems={'center'}
			padding={2}
			paddingX={2}
		>
			{!props.selectable ? (
				<>
					<Typography>Celkem {props.peopleCount || 0} uživatelé</Typography>
					<Button
						variant="text"
						color="black"
						size="small"
						onClick={() => props.onChange(true)}
					>
						Vybrat
					</Button>
				</>
			) : (
				<>
					<Box
						display={'flex'}
						flexDirection={'row'}
						alignItems={'center'}
						gap={5}
					>
						<Typography>
							Vybráno {props.selectedPeople.length} uživatelů
						</Typography>
						<SelectedPeopleActions
							selected={props.selectedPeople}
							onRemove={props.onMemberRemove}
							onRoleChange={props.onRoleChange}
						/>
					</Box>
					<Button
						variant="text"
						color="black"
						size="small"
						onClick={onCancelClick}
					>
						Zrušit výběr
					</Button>
				</>
			)}
		</Box>
	)
}
