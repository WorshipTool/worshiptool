import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { Box, SxProps, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import './EventPopupEditableInput.styles.css'

type TeamEventPopupEditableInputProps = {
	placeholder?: string
	tooltip?: string
	value?: string
	startValue?: string
	onChange?: (value: string) => void
	size?: string
	sx?: SxProps
	editable?: boolean
	autoFocus?: boolean
}

export default function TeamEventPopupEditableInput({
	editable,
	...props
}: TeamEventPopupEditableInputProps) {
	const [value, setValue] = useState(props.startValue || props.value)

	useEffect(() => {
		setValue(props.value)
	}, [props.value])

	const onChange = (value: string) => {
		setValue(value)
		props.onChange?.(value)
	}

	const theme = useTheme()
	return (
		<Tooltip label={props.tooltip} disabled={!editable}>
			{editable ? (
				<TextField
					sx={{
						borderColor: `${grey[400]}`,
						outlineColor: `${grey[400]}`,
						fontSize: props.size || '1.3rem',
						fontWeight: 600,
						[theme.breakpoints.down('sm')]: {
							display: 'none',
						},
						userSelect: 'none',
						...props.sx,
					}}
					autoFocus={props.autoFocus}
					placeholder={props.placeholder}
					value={value}
					className={'editable-text-input'}
					onChange={onChange}
				/>
			) : (
				<Box padding={0.5} paddingLeft={1}>
					<Typography strong={600} size={'1.5rem'}>
						{value}
					</Typography>
				</Box>
			)}
		</Tooltip>
	)
}
