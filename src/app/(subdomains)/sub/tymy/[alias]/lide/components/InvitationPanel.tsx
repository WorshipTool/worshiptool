import { Typography } from '@/common/ui/Typography'
import { Abc, Link } from '@mui/icons-material'
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
					gap={1}
					alignItems={'center'}
				>
					<Abc fontSize="large" />
					<Typography strong>Pomocí kódu</Typography>
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
					<Link />
					<Typography strong>Pomocí odkazu</Typography>
				</Box>
				<Typography color="grey.700">
					Pošlete jim odkaz, který je přímo připojí k týmu.
				</Typography>
			</Box>
		</Box>
	)
}
