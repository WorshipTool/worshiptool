import { SongVariantDto } from '@/api/dtos'
import { MenuItem, Select, SelectChangeEvent } from '@/common/ui/mui'

import React from 'react'

interface ChangeVariantProps {
	index: number
	variants: SongVariantDto[]
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
