import { Box, Button } from '@/common/ui'

type HideChordsButtonProps = {
	hiddenValue: boolean
	onChange: (value: boolean) => void
}

export default function HideChordsButton(props: HideChordsButtonProps) {
	return (
		<Box sx={{ color: 'grey.500' }} display={'flex'}>
			<Button
				size="small"
				color="inherit"
				onClick={() => {
					props.onChange(!props.hiddenValue)
				}}
				variant="text"
			>
				{props.hiddenValue ? 'Zobrazit akordy' : 'Skrýt akordy'}
			</Button>
		</Box>
	)
}
