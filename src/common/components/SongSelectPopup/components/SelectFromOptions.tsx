import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { useState } from 'react'

type Item = {
	label: string
}

const options: Item[] = [
	{
		label: 'Z globálního zpěvníku',
	},
	{
		label: 'Z mých písní',
	},
]

type SelectFromOptionsProps = {
	onSelect: (index: Item) => void
}
export default function SelectFromOptions() {
	const [selected, setSelected] = useState(0)

	return (
		<Box display={'flex'} flexDirection={'row'} gap={1}>
			{options.map((option, i) => (
				<Box
					key={option.label}
					onClick={() => setSelected(i)}
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
						{option.label}
					</Typography>
				</Box>
			))}
		</Box>
	)
}
