import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import { Typography } from '@/common/ui/Typography'
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
				<div>
					{Array(100)
						.fill(0)
						.map((a, i) => (
							<Typography key={i}>Ahooj{i}</Typography>
						))}
					baf
				</div>
			</Box>
		</Box>
	)
}
