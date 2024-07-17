import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import { Typography } from '@/common/ui/Typography'
import { Box, styled, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

const Container = styled(Box)(({ theme }) => ({}))

export default function LeftPanel() {
	const theme = useTheme()
	return (
		<Panel
			sx={{
				width: 300,
				// boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
				height: 'calc(100vh - 56px)',
				position: 'sticky',
				top: 56,
				[theme.breakpoints.down('sm')]: {
					display: 'none',
				},
			}}
		>
			<Box display={'flex'} flexDirection={'column'}>
				<Typography variant="h4">Pořadí písní</Typography>
				<Typography variant={'h5'} strong={200} color={grey[600]}>
					Změňte přetažením
				</Typography>
			</Box>
		</Panel>
	)
}
