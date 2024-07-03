import { Box, Button } from '@mui/material'

type HideChordsButtonProps = {
	hiddenValue: boolean
	onChange: (value: boolean) => void
}

export default function HideChordsButton(props: HideChordsButtonProps) {
	return (
		<Box sx={{ color: 'grey.500' }}>
			<Button
				size="small"
				color="inherit"
				onClick={() => {
					props.onChange(!props.hiddenValue)
				}}
			>
				{props.hiddenValue ? 'Zobrazit akordy' : 'Skrýt akordy'}
			</Button>
		</Box>
	)
}
