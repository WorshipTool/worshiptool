import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

export default function Footer() {
	const links = [
		'Hledat píseň',
		'Seznam písní',
		'O aplikaci',
		'Týmy',
		'Zpětná vazba',
		'Nahlásit chybu',
		'Kontakt',
	]

	return (
		<Box
			sx={{
				bgcolor: 'grey.200',
				borderTop: '2px solid',
				borderColor: 'grey.300',
				marginTop: 1,
				padding: 1,
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				{links.map((link) => {
					return (
						<Button
							size={'small'}
							key={link}
							color="grey.500"
							variant="text"
							sx={{
								fontWeight: 400,
							}}
						>
							{link}
						</Button>
					)
				})}
			</Box>
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				<Typography strong size={'small'}>
					Vytvořeno s ❤️{' '}
				</Typography>
				<Typography size={'small'}>-</Typography>
				<Typography size={'small'}>© Všechna práva vyhrazena</Typography>
			</Box>
		</Box>
	)
}
