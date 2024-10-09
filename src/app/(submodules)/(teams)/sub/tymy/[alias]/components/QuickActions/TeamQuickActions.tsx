import TeamFindSongButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamFindSongButton'
import TeamNewPlaylistButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamNewPlaylistButton'
import { Box } from '@mui/material'

export default function TeamQuickActions() {
	return (
		<Box display={'flex'} flexDirection={'row'} gap={1}>
			<TeamNewPlaylistButton />
			<TeamFindSongButton />
		</Box>
	)
}
