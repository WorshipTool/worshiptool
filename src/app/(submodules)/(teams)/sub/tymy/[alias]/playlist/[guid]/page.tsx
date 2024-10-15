'use client'
import { InnerPlaylistProvider } from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import TeamPlaylistContainer from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistContainer'
import TeamPlaylistTopPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistTopPanel'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartParams } from '@/routes/useSmartParams'
import { Box } from '@mui/material'

export default SmartTeamPage(TeamPlaylistPage, {
	hidePadding: true,
	collapseSideBar: true,
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
