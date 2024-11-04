'use client'

import useUsersTeamPlaylists from '@/app/(submodules)/(teams)/sub/tymy/[alias]/hooks/useUsersTeamPlaylists'
import UsersTeamPlaylistsAddButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlisty/components/UsersTeamPlaylistsAddButton'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Clickable } from '@/common/ui/Clickable'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Gap } from '@/common/ui/Gap'
import { InfoButton } from '@/common/ui/InfoButton'
import { Typography } from '@/common/ui/Typography'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Schedule } from '@mui/icons-material'
import { Box, useTheme } from '@mui/material'

export default function UsersTeamPlaylistsPanel() {
	const { playlists: usersPlaylists } = useUsersTeamPlaylists()
	const { alias: teamAlias } = useInnerTeam()

	const navigate = useSmartNavigate()

	const theme = useTheme()

	const playlists = usersPlaylists.sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	})

	const getRecentString = (date: Date) => {
		// If less than 5 minutes, 'Před chvílí'
		// If less than 1 hour, 'Před x minutami'
		// If less than 1 day, 'Před x hodinami'
		// If less than 2 days, 'Včera'
		// If less than 7 days, 'Před x dny'
		// Else 'date'
		const now = new Date()
		const diff = now.getTime() - date.getTime()

		if (diff < 1000 * 60 * 5) {
			return 'Upraveno před chvílí'
		}
		if (diff < 1000 * 60 * 60) {
			return `Před ${Math.floor(diff / (1000 * 60))} minutami`
		}

		if (diff < 1000 * 60 * 60 * 24) {
			return `před ${Math.floor(diff / (1000 * 60 * 60))} hodinami`
		}

		if (diff < 1000 * 60 * 60 * 24 * 2) {
			return 'Upraveno včera'
		}

		if (diff < 1000 * 60 * 60 * 24 * 7) {
			return `Před ${Math.floor(diff / (1000 * 60 * 60 * 24))} dny`
		}

		return `Upraveno ${date.toLocaleDateString()}`
	}

	return (
		<Box
		// sx={{ border: '2px solid', borderColor: 'primary.main' }}
		>
			<Box display={'flex'} gap={1} alignItems={'center'}>
				<Schedule />
				<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
					Tvé nedávné{' '}
					<InfoButton expandedWidth={300} lineCount={2}>
						Zde najdeš své poslední playlisty, které ale ostatní lidé v týmu
						nemusí vidět.
					</InfoButton>
				</Typography>
			</Box>
			<Gap />
			<Box display={'flex'} gap={1} flexWrap={'wrap'} alignItems={'center'}>
				{playlists.slice(0, 5).map((playlist) => (
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
									// padding: 2,
									borderRadius: 3,
									bgcolor: 'grey.100',
									border: '1px solid',
									borderColor: 'grey.400',
									width: theme.spacing(22),
									height: theme.spacing(10),
									display: 'flex',
								}}
							>
								<Box
									margin={2}
									display={'flex'}
									flexDirection={'column'}
									justifyContent={'space-between'}
								>
									<Typography strong>{playlist.title}</Typography>
									<Typography
										color="grey.500"
										size={'small'}
										strong
										sx={{
											lineHeight: 1,
										}}
									>
										{getRecentString(new Date(playlist.updatedAt))}
									</Typography>
								</Box>
							</Box>
						</Clickable>
					</Tooltip>
				))}
				<UsersTeamPlaylistsAddButton />
			</Box>
		</Box>
	)
}
