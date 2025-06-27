import { Box, Button, Chip, TextInput, Typography } from '@/common/ui'
import { Add } from '@mui/icons-material'
import { useState } from 'react'

export default function InterpretField() {
	const [interprets, setInterprets] = useState<string[]>([])
	const [value, setValue] = useState<string>('')
	return (
		<Box
			sx={{
				padding: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				bgcolor: 'grey.100',
				maxWidth: 400,
				borderRadius: 2,
			}}
		>
			<TextInput
				label="Interpet"
				placeholder="Zadejte jméno interpreta"
				value={value}
				onChange={setValue}
			/>
			<Button
				small
				startIcon={<Add />}
				onClick={() => {
					setInterprets([...interprets, value])
					setValue('')
				}}
			>
				Přidat interpreta
			</Button>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
				}}
			>
				{interprets.length > 0 && <Typography strong>Přidáno:</Typography>}
				<Box
					sx={{
						display: 'flex',
						gap: 1,
					}}
				>
					{interprets.map((interpret, index) => (
						<Chip key={interpret} label={interpret} size="small" />
					))}
				</Box>
			</Box>
		</Box>
	)
}
