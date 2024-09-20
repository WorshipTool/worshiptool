import { Gap } from '@/common/ui/Gap'
import { TextInput } from '@/common/ui/TextInput'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

type TeamEditableFieldProps = {
	label: string
	value: string
	editable?: boolean
	onChange?: (value: string) => void
}

export default function TeamEditableField(props: TeamEditableFieldProps) {
	return (
		<Box>
			<Typography strong color="grey.500">
				{props.label}
			</Typography>
			{!props.editable ? (
				<Typography>{props.value.length > 0 ? props.value : '-'}</Typography>
			) : (
				<>
					<Gap />
					<TextInput
						value={props.value}
						placeholder="Zadejte"
						onChange={props.onChange}
					/>
				</>
			)}
		</Box>
	)
}
