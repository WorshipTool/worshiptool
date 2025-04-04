import { Box, Button, Typography } from '@/common/ui'

export default function AllListPanel() {
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
			flexWrap={'wrap'}
			sx={{
				bgcolor: 'grey.100',
				borderRadius: 2,
				// padding: 2,
				overflow: 'hidden',
			}}
		>
			{/* <Typography>Nebo si vyberte ze </Typography>
			<Button size="small" variant="text" to="songsList">
				Seznamu
			</Button>
			<Typography>všech písní ve zpěvníku</Typography> */}
			{/* <Typography>Seznam všech písní ve zpěvníku</Typography> */}

			<Button
				variant="text"
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
				color="black"
				to="songsList"
				// color="primarygradient"
			>
				<Typography small color="grey.500">
					Vybrat si ze
				</Typography>
				Seznamu všech písní
			</Button>
		</Box>
	)
}
