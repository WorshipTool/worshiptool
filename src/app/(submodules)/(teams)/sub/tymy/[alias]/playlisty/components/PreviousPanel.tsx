import { TeamEventData } from '@/api/generated'
import PreviousItem from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlisty/components/PreviousItem'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { Schedule } from '@mui/icons-material'
import { Box } from '@mui/material'

type PreviousPanelProps = {
	events: TeamEventData[]
	loading: boolean
}

export default function PreviousPanel(props: PreviousPanelProps) {
	return (
		<Box minWidth={350}>
			<Box display={'flex'} gap={1}>
				<Schedule />
				<Typography variant="h6">Odehrané playlisty</Typography>
			</Box>

			<Box display={'flex'} flexDirection={'column'} gap={4}>
				{/* <Box display={'flex'} flexDirection={'column'} gap={1}>
					<Typography>Listopad 2024</Typography>
					<Box display={'flex'} flexDirection={'column'}>
						{Array.from({ length: 3 }).map((_, index) => (
							<PreviousItem key={index} />
						))}
					</Box>
				</Box> */}

				{props.events.length === 0 ? (
					<Box>
						<Gap />
						<Typography color="grey.700" italic>
							Žádné záznamy v minulosti
						</Typography>
					</Box>
				) : (
					<>
						<Box display={'flex'} flexDirection={'column'} gap={1}>
							{/* <Typography>Listopad 2024</Typography> */}
							<Box display={'flex'} flexDirection={'column'} gap={1}>
								{props.events.map((event, index) => (
									<PreviousItem key={index} data={event} />
								))}
							</Box>
						</Box>
					</>
				)}
			</Box>
		</Box>
	)
}
