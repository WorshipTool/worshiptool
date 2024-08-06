import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { RoutesKeys } from '@/routes'
import { Favorite } from '@mui/icons-material'
import { Box } from '@mui/material'

export default function Footer() {
	const links: [string, RoutesKeys | undefined][] = [
		['Hledat píseň', 'home'],
		['Seznam písní', 'songsList'],
		['O aplikaci', 'about'],
		['Týmy', 'teams'],
		['Zpětná vazba', 'documentation'],
		['Nahlásit chybu', 'documentation'],
		['Kontakt', 'contact'],
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
					const title = link[0]
					const to = link[1]
					return (
						<Button
							size={'small'}
							key={title}
							color="grey.500"
							variant="text"
							sx={{
								fontWeight: 400,
							}}
							to={to}
						>
							{title}
						</Button>
					)
				})}
			</Box>
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				<Typography strong size={'small'}>
					Vytvořeno s{' '}
					<Favorite
						color={'error'}
						sx={{
							fontSize: '0.9rem',
							transform: 'translateY(0.15rem)',
						}}
					/>
				</Typography>
				<Typography size={'small'}>-</Typography>
				<Typography size={'small'}>© Všechna práva vyhrazena</Typography>
			</Box>
		</Box>
	)
}
