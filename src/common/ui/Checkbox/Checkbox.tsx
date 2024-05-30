import { Checkbox as Check, FormControlLabel } from '@mui/material'
import { ChangeEvent } from 'react'
import { ColorType, isColorOfThemeType } from '../ui.types'

type CheckboxProps = {
	checked?: boolean
	onChange?: (event: ChangeEvent<HTMLInputElement>, value: boolean) => void
	color?: ColorType
	label?: string
}

export function Checkbox({ color, ...props }: CheckboxProps) {
	return (
		<FormControlLabel
			control={
				!color || isColorOfThemeType(color) ? (
					<Check {...props} color={color as any} />
				) : (
					<Check
						{...props}
						style={{
							color: color,
						}}
					/>
				)
			}
			label={props.label}
		/>
	)
}
