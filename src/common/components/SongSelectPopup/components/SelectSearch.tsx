import { Box, TextField } from '@mui/material'

export const SelectSearch = ({}) => {
	return (
		<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
			{/* <Box
        color={'grey.700'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
    >
        <Search color="inherit" />
    </Box> */}
			<TextField
				placeholder="Vyhledej píseň"
				sx={{
					'& input': {
						// textAlign: 'right',
					},
					width: 120,
				}}
			/>
		</Box>
	)
}
