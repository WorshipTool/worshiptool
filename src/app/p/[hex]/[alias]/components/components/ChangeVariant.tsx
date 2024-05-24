import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { VariantDTO } from '../../../../../../interfaces/variant/VariantDTO'

interface ChangeVariantProps {
	index: number
	variants: VariantDTO[]
	onChange: (i: number) => void
}

export default function ChangeVariant(props: ChangeVariantProps) {
	const getTitle = (i: number) => {
		return props.variants[i].preferredTitle || i + ''
	}

	const [value, setValue] = React.useState(getTitle(props.index))

	const onChangeHandler = (e: SelectChangeEvent) => {
		setValue(e.target.value)
		props.onChange(+e.target.value)
	}

	return (
		<div>
			<Select value={value} onChange={onChangeHandler}>
				{props.variants.map((v, index) => {
					return (
						<MenuItem value={index} key={index}>
							{getTitle(index)}
						</MenuItem>
					)
				})}
			</Select>
		</div>
	)
}
