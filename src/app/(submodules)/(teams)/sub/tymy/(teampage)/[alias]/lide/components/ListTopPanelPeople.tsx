import SelectedPeopleActions from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/lide/components/SelectedPeopleActions'
import { TeamMemberRole } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { UserGuid } from '@/interfaces/user'
import { useMemo } from 'react'

type ListTopPanelPeopleProps = {
	selectable: boolean
	selectedPeople: UserGuid[]
	onChange: (value: boolean) => void
	peopleCount?: number
	loading: boolean

	role: TeamMemberRole

	onMemberRemove: (guid: UserGuid) => void
	onRoleChange: (guid: UserGuid, role: TeamMemberRole) => void
}

export default function ListTopPanelPeople(props: ListTopPanelPeopleProps) {
	const onCancelClick = () => {
		props.onChange(false)
	}

	const totalCount = useMemo(() => {
		return props.peopleCount || 0
	}, [props.peopleCount])

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
					<Typography>
						{/* V týmu {totalCount < 5 && totalCount > 1 ? 'jsou' : 'je'}  */}
						Celkem {totalCount}{' '}
						{totalCount === 1
							? 'uživatel'
							: totalCount < 5
							? 'uživatelé'
							: 'uživatelů'}
					</Typography>
					{props.role === TeamMemberRole.MANAGER && (
						<Button
							variant="text"
							color="black"
							size="small"
							onClick={() => props.onChange(true)}
						>
							Vybrat
						</Button>
					)}
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
