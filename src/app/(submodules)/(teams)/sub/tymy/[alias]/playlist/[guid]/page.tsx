'use client'
import { InnerPlaylistProvider } from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import TeamPlaylistContainer from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistContainer'
import TeamPlaylistTopPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistTopPanel'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartParams } from '@/routes/useSmartParams'
import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'

export default SmartTeamPage(TeamPlaylistPage, {
	hidePadding: true,
	collapseSideBar: true,
	fixedTopBar: true,
	topBarSx: {
		bgcolor: 'grey.200',
		borderBottom: `1px solid ${grey[400]}`,
	},
})

function TeamPlaylistPage() {
	const { guid } = useSmartParams('teamPlaylist')

	return (
		<Box>
			{!guid ? null : (
				<InnerPlaylistProvider guid={guid as PlaylistGuid}>
					<TeamPageTitle>
						<TeamPlaylistTopPanel />
					</TeamPageTitle>
					{/* <Box bgcolor={'blue'}>ahoj</Box> */}
					<TeamPlaylistContainer />
				</InnerPlaylistProvider>
			)}
		</Box>
	)
}
