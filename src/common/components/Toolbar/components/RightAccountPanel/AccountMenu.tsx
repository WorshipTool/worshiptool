import { Divider } from '@/common/ui'
import { ListItemText, Menu, MenuItem } from '@/common/ui/mui'
import useAuth from '../../../../../hooks/auth/useAuth'
import { Gap } from '../../../../ui/Gap'
import { Link } from '../../../../ui/Link/Link'

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
				<MenuItem onClick={onClose}>
					<ListItemText
						primary={user?.firstName + ' ' + user?.lastName}
						secondary={'Spravovat účet'}
					/>
				</MenuItem>
			</Link>
			<Gap value={0.5} />
			<Divider />
			<Gap value={0.5} />
			{/* <Link to="usersPlaylists" params={{}}>
				<MenuItem>
					<ListItemIcon>
						<MenuSharp />
					</ListItemIcon>
					Playlisty
				</MenuItem>
			</Link>
			<Link to="usersSongs" params={{}}>
				<MenuItem>
					<ListItemIcon>
						<LibraryMusic />
					</ListItemIcon>
					Moje písně
				</MenuItem>
			</Link> */}

			{/* <Gap value={0.5} />
			<Divider />
			<Gap value={0.5} /> */}
			<MenuItem onClick={onLogoutClick}>
				{/* <ListItemIcon>
					<Logout />
				</ListItemIcon> */}
				Odhlásit se
			</MenuItem>
		</Menu>
	)
}
