import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import MiddlePanel from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/MiddlePanel'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import { Box } from '@mui/material'

export default function PlaylistPreview() {
	return (
		<Box position={'relative'}>
			<TopPlaylistPanel />
			<Box display={'flex'} flexDirection={'row'} position={'relative'}>
				<LeftPanel />
				<MiddlePanel />
			</Box>
		</Box>
	)
}
