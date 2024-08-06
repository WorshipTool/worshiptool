import { Box, LinearProgress } from '@mui/material'

export default function Loading() {
	return (
		<>
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
				}}
			>
				<LinearProgress
					sx={{
						height: 4,
					}}
				/>
			</Box>
		</>
	)
}
