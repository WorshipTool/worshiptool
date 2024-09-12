import { TeamMemberDto } from '@/api/generated'
import ActionsPartPeople from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/ActionsPartPeople'
import RolePart from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/RolePart'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { TeamMemberRole } from '@/app/(subdomains)/sub/tymy/tech'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Typography } from '@/common/ui/Typography'
import { UserGuid } from '@/interfaces/user'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { ExitToApp } from '@mui/icons-material'
import { Avatar, Box, Checkbox } from '@mui/material'
import { useSnackbar } from 'notistack'
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

	const [popupOpen, setPopupOpen] = useState(false)

	const [role, setRole] = useState<TeamMemberRole>(props.data.role)
	const navigate = useSmartNavigate()
	const { enqueueSnackbar } = useSnackbar()
	useEffect(() => {
		if (props.selectable) {
			setEditable(false)
		}
	}, [props.selectable])

	const editable = useMemo(() => {
		return _editable && !props.me && !props.selectable
	}, [_editable, props.me, props.selectable])

	const onRemove = useCallback(() => {
		props.onMemberRemove(props.data.userGuid as UserGuid)
		setPopupOpen(false)
		if (props.me) {
			navigate('teams', {})
			enqueueSnackbar('Opustil jsi tým')
		}
	}, [])

	const onEditableChange = useCallback(
		(editable: boolean) => {
			setEditable(editable)
			if (!editable) {
				props.onChangeRole(props.data.userGuid as UserGuid, role)
			}
		},
		[role, props.data]
	)

	const { createdByGuid } = useInnerTeam()
	const isCreator = useMemo(() => {
		if (!createdByGuid) return false
		return createdByGuid === props.data.userGuid
	}, [createdByGuid])

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
			<RolePart
				editable={editable}
				role={role}
				onRoleChange={setRole}
				isOwner={isCreator}
			/>
			<Box></Box>
			{!props.me ? (
				<ActionsPartPeople
					data={props.data}
					editable={editable}
					onEditableChange={onEditableChange}
					selectable={Boolean(props.selectable)}
					onRemove={() => setPopupOpen(true)}
				/>
			) : (
				<Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
					<Tooltip
						label={
							isCreator ? 'Nelze opustit skupinu, které jsi vlastníkem' : ''
						}
					>
						<Button
							tooltip="Opustit tým"
							color="error"
							size="small"
							variant="outlined"
							endIcon={<ExitToApp />}
							disabled={props.selectable || isCreator}
							onClick={() => setPopupOpen(true)}
						>
							Odejít
						</Button>
					</Tooltip>
				</Box>
			)}
			<Popup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				title={props.me ? 'Opustit skupinu?' : 'Odebrat z týmu?'}
				subtitle={
					props.me
						? 'Opravdu chceš opustit tuto skupinu? '
						: 'Opravdu chceš odebrat tohoto člena z týmu?'
				}
				actions={
					<>
						<Box flex={1} />

						<Button
							variant="text"
							color="error"
							size="small"
							onClick={onRemove}
						>
							{props.me ? 'Opustit' : 'Odebrat'}
						</Button>
						<Button size="small" type="reset">
							Zrušit
						</Button>
					</>
				}
			></Popup>
		</>
	)
}
