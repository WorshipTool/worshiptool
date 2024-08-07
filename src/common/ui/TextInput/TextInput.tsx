import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import './textinput.styles.css'

type TextInputProps = {
	title?: string
	error?: boolean
} & React.ComponentProps<typeof TextField>

export function TextInput(props: TextInputProps) {
	return (
		<Box display={'flex'} flexDirection={'column'} flex={1}>
			{props.title && <Typography strong>{props.title}</Typography>}
			<TextField {...props} className="custom-text-input" />
		</Box>
	)
}
