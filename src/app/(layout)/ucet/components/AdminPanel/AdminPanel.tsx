import BridgeServicesPanel from '@/app/(layout)/ucet/components/AdminPanel/components/BridgeServicesPanel'
import { Box, Divider } from '@/common/ui'
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
				<BridgeServicesPanel />
				<Divider />
				<GetToken />
			</Box>
			<Box>
				<Divider orientation={'vertical'} />
			</Box>
			<Box flex={1} gap={1} display={'flex'} flexDirection={'column'}>
				<GetterGraphs />
			</Box>
		</Box>
	)
}
