import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import MiddlePanel from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/MiddlePanel'
import SongDropPlaylistContainer from '@/app/(layout)/playlist/[guid]/components/SongDropPlaylistContainer'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import { Box } from '@/common/ui'

export default function PlaylistPreview() {
	return (
		<SongDropPlaylistContainer>
			<Box position={'relative'}>
				<TopPlaylistPanel />

				<Box
					display={'flex'}
					flexDirection={'row'}
					position={'relative'}
					minHeight={'calc(100vh - 140px)'}
				>
					<LeftPanel />
					<MiddlePanel />
					{/* <RightPanel /> */}
				</Box>
			</Box>
		</SongDropPlaylistContainer>
	)
}
