import { Box, Divider } from '@mui/material'
import AddPermissionToUser from './components/AddPermissionToUser/AddPermissionToUser'
import CreateGroupPanel from './components/CreateGroupPanel/CreateGroupPanel'
import CurrentSongCount from './components/CurrentSongCount'
import GetToken from './components/GetToken'

export default function AdminPanel() {
	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			<CurrentSongCount />
			<Divider />
			<AddPermissionToUser />
			<Divider />
			<CreateGroupPanel />
			<Divider />
			<GetToken />
		</Box>
	)
}
