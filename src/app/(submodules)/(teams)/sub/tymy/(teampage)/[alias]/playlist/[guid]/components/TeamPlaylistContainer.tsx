import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import SongDropPlaylistContainer from '@/app/(layout)/playlist/[guid]/components/SongDropPlaylistContainer'
import TeamPlaylistMiddlePanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlist/[guid]/components/TeamPlaylistMiddlePanel'
import { Box } from '@/common/ui'

export default function TeamPlaylistContainer() {
	return (
		<SongDropPlaylistContainer>
			<Box position={'relative'}>
				<Box
					display={'flex'}
					flexDirection={'row'}
					position={'relative'}
					minHeight={'calc(100vh - 140px)'}
				>
					<LeftPanel
						sx={{
							top: 92,
							position: 'fixed',
							// borderTopRightRadius: 4,
							// borderTop: '1px solid ',
							// borderColor: 'grey.400',
						}}
					/>
					<TeamPlaylistMiddlePanel />
					{/* <MiddlePanel /> */}
					{/* <RightPanel /> */}
				</Box>
			</Box>
		</SongDropPlaylistContainer>
	)
}
