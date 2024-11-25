import { Box, Button, Tooltip, Typography } from '@/common/ui'
import { ButtonGroup, styled } from '@/common/ui/mui'
import { Gap } from '../../../../common/ui/Gap'

const Container = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[200],
	boxShadow: `0px 0px 4px ${theme.palette.grey[400]}`,
	padding: theme.spacing(1),
	display: 'flex',
	flexDirection: 'column',
}))

interface ToolPaneProps {
	onNewSection: (name: string) => void
	onNewChord: () => void
}

export default function ToolPanel({ onNewSection, onNewChord }: ToolPaneProps) {
	return (
		<Container>
			<Typography>Označ sekci:</Typography>

			<ButtonGroup orientation="horizontal">
				<Tooltip title={'Sloka'}>
					<Button
						onClick={() => {
							onNewSection('V')
						}}
					>
						V
					</Button>
				</Tooltip>
				<Tooltip title={'Refrén'}>
					<Button
						onClick={() => {
							onNewSection('R')
						}}
					>
						R
					</Button>
				</Tooltip>
				<Tooltip title={'Bridge'}>
					<Button
						onClick={() => {
							onNewSection('B')
						}}
					>
						B
					</Button>
				</Tooltip>
			</ButtonGroup>
			<Gap value={0.5} />
			<Typography
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				{'Alt + V/R/B'}
			</Typography>

			<Gap value={2} />

			<Tooltip title={'Vložit akord'}>
				<Button
					variant="contained"
					onClick={() => {
						onNewChord()
					}}
					sx={{ display: 'flex', flexDirection: 'column' }}
				>
					Vlož akord
					<Typography>{'Alt + C'}</Typography>
				</Button>
			</Tooltip>
		</Container>
	)
}
