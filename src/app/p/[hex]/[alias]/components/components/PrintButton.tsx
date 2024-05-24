import { Print } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { Button } from '../../../../../../common/ui/Button'
import { IconButton } from '../../../../../../common/ui/IconButton'

interface PrintButtonProps {}

export default function PrintButton(props: PrintButtonProps) {
	const onPrintClick = () => {
		window.print()
	}
	const theme = useTheme()
	return (
		<div>
			<Button
				endIcon={<Print />}
				variant="outlined"
				color="primary"
				onClick={onPrintClick}
				tooltip="Tisknout"
				sx={{
					[theme.breakpoints.down('lg')]: {
						display: 'none',
					},
				}}
			>
				Tisknout
			</Button>
			<IconButton
				onClick={onPrintClick}
				tooltip="Tisknout"
				sx={{
					[theme.breakpoints.up('lg')]: {
						display: 'none',
					},
				}}
			>
				<Print />
			</IconButton>
		</div>
	)
}
