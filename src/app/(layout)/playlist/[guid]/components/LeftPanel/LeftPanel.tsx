import PlaylistMenuList from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PlaylistMenuList'
import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import { Typography } from '@/common/ui/Typography'
import { Box, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

export default function LeftPanel() {
	const theme = useTheme()
	return (
		<Panel
			sx={{
				width: 300,
				height: 'calc(100vh - 160px)',
				// boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
				position: 'sticky',
				top: 127,
				// top: 126,
				// bottom: 0,
				[theme.breakpoints.down('sm')]: {
					display: 'none',
				},
				// backgroundColor: grey[200],
			}}
		>
			<Box display={'flex'} flexDirection={'column'}>
				<Typography variant="h4">Pořadí písní</Typography>
				<Typography variant={'h5'} strong={200} color={grey[600]}>
					Změňte přetažením
				</Typography>
				<PlaylistMenuList />
			</Box>
		</Panel>
	)
}
