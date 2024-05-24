import { ListItemText, Menu, MenuItem } from '@mui/material'
import useAuth from '../../../../hooks/auth/useAuth'
import { Link } from '../../../ui/Link/CustomLink'

interface AccountMenuProps {
	anchor: Element | null
	open: boolean
	onClose: () => void
}

export default function AccountMenu({
	anchor,
	open,
	onClose,
}: AccountMenuProps) {
	const { logout, user } = useAuth()

	const onLogoutClick = () => {
		logout()
		onClose()
	}

	return (
		<Menu
			disableScrollLock
			anchorEl={anchor}
			open={open}
			onClose={onClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
		>
			<Link to="account" params={{}}>
				<MenuItem>
					<ListItemText
						primary={user?.firstName + ' ' + user?.lastName}
						secondary={'Spravovat'}
					/>
				</MenuItem>
			</Link>
			<MenuItem onClick={onLogoutClick}>Odhlásit se</MenuItem>
		</Menu>
	)
}
