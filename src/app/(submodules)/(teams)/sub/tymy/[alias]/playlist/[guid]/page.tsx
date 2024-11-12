'use client'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import TeamPlaylistContainer from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistContainer'
import TeamPlaylistTopPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistTopPanel'
import { grey } from '@/common/ui/mui/colors'

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
	return (
		<>
			<TeamPageTitle>
				<TeamPlaylistTopPanel />
			</TeamPageTitle>
			{/* <Box bgcolor={'blue'}>ahoj</Box> */}
			<TeamPlaylistContainer />
		</>
	)
}
