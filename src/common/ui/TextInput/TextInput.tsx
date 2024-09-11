import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import './textinput.styles.css'

type TextInputProps = {
	title?: string
	error?: boolean
} & React.ComponentProps<typeof TextField>

export function TextInput({ title, ...props }: TextInputProps) {
	return (
		<Box display={'flex'} flexDirection={'column'} flex={1}>
			{title && <Typography strong>{title}</Typography>}
			<TextField {...props} className="custom-text-input" />
		</Box>
	)
}
