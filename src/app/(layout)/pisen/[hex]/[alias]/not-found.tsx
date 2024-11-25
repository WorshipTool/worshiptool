import { Box } from '@/common/ui'
import { Typography } from '../../../../../common/ui/Typography/Typography'

export default function NotFound() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: 3,
			}}
		>
			<Typography variant="normal">Píseň nebyla nalezena.</Typography>
		</Box>
	)
}
