import TeamCurrentPlaylistQuickButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamCurrentPlaylistQuickButton'
import TeamFindSongButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamFindSongButton'
import TeamNewPlaylistButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamNewPlaylistButton'
import { Box } from '@/common/ui'

export default function TeamQuickActions() {
	return (
		<Box
			display={'flex'}
			gap={1}
			sx={{
				flexFlow: 'row wrap',
			}}
		>
			<TeamNewPlaylistButton />
			<TeamFindSongButton />
			<TeamCurrentPlaylistQuickButton />
		</Box>
	)
}
