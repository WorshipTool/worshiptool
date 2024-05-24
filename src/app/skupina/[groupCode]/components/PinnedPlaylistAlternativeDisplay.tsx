import { PushPin } from '@mui/icons-material'
import { Box, Divider, useTheme } from '@mui/material'
import { Clickable } from '../../../../common/ui/Clickable'
import { Gap } from '../../../../common/ui/Gap'
import { Typography } from '../../../../common/ui/Typography'
import PlaylistDTO from '../../../../interfaces/playlist/PlaylistDTO'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'

type PinnedPlaylistAlternativeDisplayProps = {
	playlist: PlaylistDTO
}

export default function PinnedPlaylistAlternativeDisplay({
	playlist,
}: PinnedPlaylistAlternativeDisplayProps) {
	const theme = useTheme()
	const navigate = useSmartNavigate()
	return (
		<Box marginTop={2} marginBottom={1} width={'100%'}>
			<Clickable onClick={() => navigate('playlist', { guid: playlist.guid })}>
				<Box
					bgcolor={theme.palette.secondary.main}
					sx={{
						borderRadius: 2,
						padding: 2,
					}}
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={2}
				>
					<PushPin />

					<Box>
						<Typography>Připnutý playlisty</Typography>
						<Typography strong>{playlist.title}</Typography>
					</Box>
				</Box>
			</Clickable>
			<Gap />
			<Divider />
		</Box>
	)
}
