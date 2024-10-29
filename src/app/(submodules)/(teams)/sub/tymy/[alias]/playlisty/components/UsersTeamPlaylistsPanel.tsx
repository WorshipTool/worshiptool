'use client'

import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import useUsersTeamPlaylists from '@/app/(submodules)/(teams)/sub/tymy/[alias]/hooks/useUsersTeamPlaylists'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Clickable } from '@/common/ui/Clickable'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { VpnLock } from '@mui/icons-material'
import { Box } from '@mui/material'

export default function UsersTeamPlaylistsPanel() {
	const { playlists } = useUsersTeamPlaylists()
	const { alias: teamAlias } = useInnerTeam()

	const navigate = useSmartNavigate()

	return (
		<TeamCard
		// sx={{ border: '2px solid', borderColor: 'primary.main' }}
		>
			<Box display={'flex'} gap={1}>
				<VpnLock />
				<Typography variant="h6">Tvé soukromé playlisty</Typography>
			</Box>
			<Gap />
			<Box display={'flex'} gap={1} flexWrap={'wrap'}>
				{playlists.map((playlist) => (
					<Tooltip key={playlist.guid} label="Otevřít playlist">
						<Clickable
							key={playlist.guid}
							onClick={() =>
								navigate('teamPlaylist', {
									alias: teamAlias,
									guid: playlist.guid,
								})
							}
						>
							<Box
								key={playlist.guid}
								sx={{
									padding: 1,
									borderRadius: 1,
									// bgcolor: 'secondary.main',
									border: '1px solid',
									borderColor: 'grey.400',
								}}
							>
								<Typography>{playlist.title}</Typography>
							</Box>
						</Clickable>
					</Tooltip>
				))}
			</Box>
		</TeamCard>
	)
}
