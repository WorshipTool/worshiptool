import { Box } from '@mui/material'

type GoodFormatCheckProps = {
	inFormat: boolean
}
export default function GoodFormatCheck(props: GoodFormatCheckProps) {
	return (
		// <Typography>
		// 	{props.inFormat ? 'V dobrém formátu' : 'Není ve správném formátu'}
		// </Typography>
		<>
			<Box
				sx={{
					// width: '3rem',
					paddingX: '0.5rem',
					height: '2rem',
					borderRadius: '0.5rem',
					// bgcolor: 'black',
					// bgcolor: props.inFormat ? 'success.main' : 'grey.300',
					// borderColor: 'grey.500',
					// borderWidth: '1px',
					// borderStyle: 'solid',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: '0.2rem',
				}}
			>
				{props.inFormat ? (
					<>
						{/* <ButtonGroup size="small" color="success" variant="contained">
							<Button>
								<CheckCircle />
							</Button>
							<Button>Zveřejnit</Button>
						</ButtonGroup> */}
					</>
				) : (
					<>{/* <Error color="inherit" /> */}</>
				)}
			</Box>
		</>
	)
}
