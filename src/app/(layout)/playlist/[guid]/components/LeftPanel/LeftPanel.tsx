import PlaylistMenuList from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PlaylistMenuList'
import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Typography } from '@/common/ui/Typography'
import useSongDrag from '@/hooks/dragsong/useSongDrag'
import { Box, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import './LeftPanel.styles.css'

export default function LeftPanel() {
	const { canUserEdit } = useInnerPlaylist()
	const theme = useTheme()

	const { isDragging } = useSongDrag()
	return (
		<Box
			sx={{
				[theme.breakpoints.down('sm')]: {
					display: 'none',
				},
			}}
		>
			<Box
				sx={{
					width: 335,
				}}
			/>
			<Panel
				sx={{
					width: 300,
					position: 'fixed',
					top: 127,
					bottom: 0,
					backgroundColor: grey[100],
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'space-between'}
				>
					<Typography strong={500}>Pořadí písní:</Typography>
					{canUserEdit && (
						<Typography strong={300} color={grey[600]}>
							Změňte přetažením
						</Typography>
					)}
				</Box>
				<Box display={'flex'}>
					<Box
						sx={{
							bgcolor: isDragging ? 'red' : 'grey.300',
							padding: 1,
						}}
					>
						Ahoj
					</Box>
				</Box>
				<Box
					sx={{
						'&::-webkit-scrollbar': {
							display: 'auto',
						},
						position: 'relative',
						paddingBottom: 8,
						overflowY: 'auto',
						height: `calc(100vh - 160px - ${theme.spacing(2)})`,
					}}
					className={'song-menu-list'}
				>
					<PlaylistMenuList />
				</Box>
			</Panel>
		</Box>
	)
}
