'use client'
import { Box, Button, Checkbox, Gap, Typography } from '@/common/ui'
import { useSmartSearchParam } from '@/routes/useSmartSearchParam'
import { Print } from '@mui/icons-material'

type PlaylistPrintOptionsProps = {
	onPrint: () => void
}

export default function PlaylistPrintOptions(props: PlaylistPrintOptionsProps) {
	const [checked, setChecked] = useSmartSearchParam(
		'playlistPrint',
		'landscapeMode',
		{
			parse: (v) => v === 'true',
			stringify: (v) => (v ? 'true' : 'false'),
		}
	)

	const onChange = (v: boolean) => {
		setChecked(v ? true : null)
	}

	return (
		<Box
			sx={{
				bgcolor: 'grey.200',
				borderRadius: 2,
				padding: 2,
				boxShadow: 1,
			}}
		>
			<Typography strong>Možnosti tisku</Typography>

			<Checkbox
				onChange={(e, v) => onChange(v)}
				checked={checked === true}
				label="Použít zobrazení na šířku"
			/>

			<Gap value={1} />
			<Box display={'flex'} justifyContent={'center'}>
				<Button
					sx={{
						flex: 1,
					}}
					endIcon={<Print />}
					variant={'outlined'}
					onClick={props.onPrint}
				>
					Tisk
				</Button>
			</Box>
		</Box>
	)
}
