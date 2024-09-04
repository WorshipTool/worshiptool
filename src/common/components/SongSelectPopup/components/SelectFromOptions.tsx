import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { useState } from 'react'

type Item = {
	label: string
	count?: number
}

type SelectFromOptionsProps = {
	options: Item[]
	initialSelected: number
	onSelect: (item: Item, index: number) => void
}
export default function SelectFromOptions(props: SelectFromOptionsProps) {
	const [selected, setSelected] = useState(props.initialSelected)
	const options: Item[] = props.options

	const onChange = (index: number) => {
		setSelected(index)
		props.onSelect(options[index], index)
	}

	return (
		<Box display={'flex'} flexDirection={'row'} gap={1}>
			{options.map((option, i) => (
				<Box
					key={option.label}
					onClick={() => onChange(i)}
					sx={{
						cursor: 'pointer',
					}}
				>
					<Typography
						color={i === selected ? 'black' : 'text.disabled'}
						sx={{
							userSelect: 'none',
						}}
					>
						{option.label} {option.count !== undefined && ` (${option.count})`}
					</Typography>
				</Box>
			))}
		</Box>
	)
}
