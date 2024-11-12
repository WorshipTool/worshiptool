import { Checkbox as Check, FormControlLabel } from '@mui/material'
import { ChangeEvent, useMemo } from 'react'
import { ColorType, isColorOfThemeType } from '../ui.types'

type CheckboxProps = {
	checked?: boolean

	onChange?: (event: ChangeEvent<HTMLInputElement>, value: boolean) => void
	color?: ColorType
	label?: string
}

export function Checkbox({ color, ...props }: CheckboxProps) {
	const checkBox = useMemo(() => {
		return !color || isColorOfThemeType(color) ? (
			<Check {...props} color={color as any} />
		) : (
			<Check
				{...props}
				style={{
					color: color,
				}}
			/>
		)
	}, [color, props])
	return props.label ? (
		<FormControlLabel control={checkBox} label={props.label} />
	) : (
		checkBox
	)
}
