'use client'
import { Typography } from '@/common/ui/Typography'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import useSongDrag from '@/hooks/dragsong/useSongDrag'
import { PlaylistAdd } from '@mui/icons-material'
import { Box } from '@mui/material'

export default function FloatingPlaylist() {
	const { isDragging } = useSongDrag()

	return (
		<SongDropContainer>
			{(over) => (
				<Box
					sx={{
						padding: '1rem',
						position: 'fixed',
						bottom: isDragging ? 0 : -100,
						// bottom: 0,
						right: '50%',
						transform: `translateX(50%) scale(${over ? 1.05 : 1})`,
						transition: 'all 0.3s',

						borderRadius: '1rem 1rem 0 0',
						display: 'flex',
						flexDirection: 'row',
						// alignItems: 'center',
						gap: 1,

						// borderColor: 'secondary.dark',
						// borderStyle: 'solid',
						// borderWidth: 2,
						// borderBottomWidth: 0,

						bgcolor: over ? 'secondary.dark' : 'secondary.main',
					}}
				>
					<PlaylistAdd />
					<Box display={'flex'} flexDirection={'row'} gap={0.5}>
						<Typography strong>Přidat do</Typography>
						<Typography>Neděle 21.7.</Typography>
					</Box>
				</Box>
			)}
		</SongDropContainer>
	)
}
