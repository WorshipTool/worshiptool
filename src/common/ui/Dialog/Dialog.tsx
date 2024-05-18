import { Box, Dialog as DialogComponent, DialogContent } from '@mui/material'
import { Gap } from '../Gap'
import { Typography } from '../Typography/Typography'
type DialogProps = {
	children?: React.ReactNode
	title?: string
	description?: string
	buttons?: React.ReactNode
	open: boolean
	onClose?: () => void
}

export default function Dialog(props: DialogProps) {
	return (
		<DialogComponent open={props.open}>
			<DialogContent>
				{props.title && <Typography variant="h6">{props.title}</Typography>}
				{props.description && <Typography>{props.description}</Typography>}
				{props.children}
				<Gap />
				{props.buttons && (
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'end'}
						gap={1}
					>
						{props.buttons}
					</Box>
				)}
			</DialogContent>
		</DialogComponent>
	)
}
