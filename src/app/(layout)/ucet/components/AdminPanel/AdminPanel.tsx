import { Box, Divider } from '@mui/material'
import AddPermissionToUser from './components/AddPermissionToUser/AddPermissionToUser'
import CreateGroupPanel from './components/CreateGroupPanel/CreateGroupPanel'
import CurrentSongCount from './components/CurrentSongCount'
import GetToken from './components/GetToken'
import GetterGraphs from './components/GetterGraphs'

export default function AdminPanel() {
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			flexWrap={'wrap'}
			gap={1}
			width={'100%'}
		>
			<Box display={'flex'} flexDirection={'column'} gap={1}>
				<CurrentSongCount />
				<Divider />
				<AddPermissionToUser />
				<Divider />
				<CreateGroupPanel />
				<Divider />
				<GetToken />
			</Box>
			<Box>
				<Divider orientation={'vertical'} />
			</Box>
			<Box flex={1}>
				<GetterGraphs />
			</Box>
		</Box>
	)
}
