import { Gap } from '@/common/ui/Gap'
import { InfoButton } from '@/common/ui/InfoButton'
import { Link } from '@/common/ui/Link/Link'
import { Typography } from '@/common/ui/Typography'
import { Abc, Link as LinkIcon } from '@mui/icons-material'
import { Box } from '@mui/material'

type InvitationPanelProps = {
	joinCode: string
}

export default function InvitationPanel(props: InvitationPanelProps) {
	return (
		<Box display={'flex'} flexDirection={'column'} gap={4}>
			<Box flex={1}>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					// gap={1}
				>
					<Abc fontSize="large" />
					<Gap horizontal value={0.5} />
					<Typography strong>Pomocí kódu</Typography>
					<InfoButton expandedWidth={300} lineCount={2}>
						Na stránce{' '}
						<Link to="teams" params={{}}>
							{"'týmy'"}
						</Link>{' '}
						lze po kliknutí na tlačítko {"'Připojit se'"} zadat kód.
					</InfoButton>
				</Box>
				<Typography color="grey.700">
					Jako vedoucí jim poskytněte kód, kterým se mohou připojit {'-> '}
					<strong>
						<i>{props.joinCode}</i>
					</strong>
				</Typography>
			</Box>
			<Box flex={1}>
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={2}
					alignItems={'center'}
				>
					<LinkIcon />
					<Typography strong>Pomocí odkazu</Typography>
				</Box>
				<Typography color="grey.700">
					Pošlete jim odkaz, který je přímo připojí k týmu.
				</Typography>
			</Box>
		</Box>
	)
}
