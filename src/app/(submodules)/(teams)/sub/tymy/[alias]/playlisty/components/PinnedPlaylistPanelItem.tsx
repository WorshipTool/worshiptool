import { PlaylistData } from '@/api/generated'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { Clickable } from '@/common/ui/Clickable'
import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Close, PushPin } from '@mui/icons-material'
import { Box, Chip, useTheme } from '@mui/material'
import { useState } from 'react'

type PinnedPlaylistPanelItemProps = {
	data: PlaylistData
	onRemove: () => void
}

export default function PinnedPlaylistPanelItem({
	data: playlist,
	onRemove,
}: PinnedPlaylistPanelItemProps) {
	const navigate = useSmartNavigate()
	const { alias: teamAlias, guid: teamGuid } = useInnerTeam()
	const theme = useTheme()

	const hasPermissionToRemove = usePermission<TeamPermissions>(
		'team.unpin_playlist',
		{ teamGuid }
	)

	const [over, setOver] = useState(false)

	const [overClose, setOverClose] = useState(false)

	return (
		<Clickable
			tooltip={!overClose ? 'Otevřít playlist' : 'Odebrat'}
			key={playlist.guid}
			onClick={() =>
				navigate('teamPlaylist', {
					alias: teamAlias,
					guid: playlist.guid,
				})
			}
		>
			<Box
				sx={{
					width: theme.spacing(22),
					aspectRatio: '3/2',
					bgcolor: 'secondary.main',
					borderRadius: 3,
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					justifyContent: 'center',
					alignItems: 'center',
					// color: 'grey.700',
					position: 'relative',
				}}
				onMouseEnter={() => setOver(true)}
				onMouseLeave={() => setOver(false)}
			>
				<Box display={'flex'} flexDirection={'row'} gap={1}>
					{/* <PushPin /> */}
					<Chip label={'Připnuto'} size="small" icon={<PushPin />} />
				</Box>
				<Typography strong align="center">
					{playlist.title}
				</Typography>

				{hasPermissionToRemove && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							right: 0,
							opacity: over ? 1 : 0,
							transition: 'opacity 0.2s',
						}}
						onMouseEnter={() => setOverClose(true)}
						onMouseLeave={() => setOverClose(false)}
					>
						<IconButton
							onClick={(e) => {
								e.stopPropagation()
								onRemove()
							}}
							size="small"
						>
							<Close />
						</IconButton>
					</Box>
				)}
			</Box>
		</Clickable>
	)
}
