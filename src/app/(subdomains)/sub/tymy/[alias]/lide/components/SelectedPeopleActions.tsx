import { teamMemberRoles } from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/RolePart'
import { TeamMemberRole } from '@/app/(subdomains)/sub/tymy/tech'
import Menu from '@/common/components/Menu/Menu'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import useAuth from '@/hooks/auth/useAuth'
import { UserGuid } from '@/interfaces/user'
import { ExpandMore } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

type SelectedPeopleActionsProps = {
	selected: UserGuid[]
	onRemove: (guid: UserGuid) => void
	onRoleChange: (guid: UserGuid, role: TeamMemberRole) => void
}

export default function SelectedPeopleActions(
	props: SelectedPeopleActionsProps
) {
	const [open, setOpen] = useState(false)
	const [roleMenuOpen, setRoleMenuOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [roleAnchorEl, setRoleAnchorEl] = useState<HTMLElement | null>(null)

	const { user } = useAuth()
	const includesMe = useMemo(
		() => user && props.selected.includes(user.guid),
		[props.selected, user]
	)

	const [popupOpen, setPopupOpen] = useState(false)

	const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget)
		setOpen(true)
	}, [])

	const onChangeRoleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
		setRoleAnchorEl(e.currentTarget)
		setRoleMenuOpen(true)
	}, [])

	const onRemoveClick = useCallback(() => {
		props.selected.forEach((guid) => {
			props.onRemove(guid)
		})

		closeAll()
	}, [props.selected])

	const onRoleChange = useCallback(
		(role: TeamMemberRole) => {
			props.selected.forEach((guid) => {
				props.onRoleChange(guid, role)
			})
			closeAll()
		},
		[props.selected]
	)

	const closeAll = useCallback(() => {
		setOpen(false)
		setRoleMenuOpen(false)
		setPopupOpen(false)
	}, [])

	const moreIcon = useMemo(() => <ExpandMore />, [])

	return (
		<Box>
			<Button
				size="small"
				onClick={onClick}
				disabled={props.selected.length === 0}
				endIcon={moreIcon}
			>
				Akce
			</Button>

			<Menu
				open={open}
				anchor={anchorEl}
				onClose={() => setOpen(false)}
				items={[
					{
						title: 'Odebrat z týmu',
						onClick: () => setPopupOpen(true),
					},
					{
						title: 'Nastavit roli na',
						onClick: onChangeRoleClick,
					},
				]}
			/>

			<Menu
				open={roleMenuOpen}
				anchor={roleAnchorEl}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => setRoleMenuOpen(false)}
				items={Object.entries(teamMemberRoles).map(([key, value]) => ({
					title: value,
					onClick: () => onRoleChange(key as any as TeamMemberRole),
				}))}
			/>
			<Popup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				title="Opravdu odebrat?"
				subtitle="Opravdu chcete odebrat označené lidi ze skupiny?"
				actions={[
					<>
						<Button
							size="small"
							color="black"
							variant="text"
							onClick={() => {
								setPopupOpen(false)
							}}
						>
							Zrušit
						</Button>
						<Tooltip label={includesMe ? 'Nelze odebrát sám sebe' : ''}>
							<Button
								size="small"
								color="error"
								onClick={() => {
									onRemoveClick()
								}}
								disabled={includesMe}
							>
								Odebrat
							</Button>
						</Tooltip>
					</>,
				]}
			/>
		</Box>
	)
}
