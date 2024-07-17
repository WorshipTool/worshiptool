import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import { Box } from '@mui/material'

export default function PlaylistPreview() {
	// const onSearchClick = () => {
	// 	window.dispatchEvent(new Event('searchBarFocus'))
	// }

	return (
		<Box>
			<TopPlaylistPanel />
			<Box display={'flex'} flexDirection={'row'}>
				<LeftPanel />
				hurahej
			</Box>
		</Box>
	)
}
