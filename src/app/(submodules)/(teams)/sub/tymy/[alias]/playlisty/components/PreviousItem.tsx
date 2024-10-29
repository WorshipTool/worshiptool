'use client'
import { TeamEventData } from '@/api/generated'
import TeamEventPopup from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/EventPopup/TeamEventPopup'
import { Clickable } from '@/common/ui/Clickable'
import { Typography } from '@/common/ui/Typography'
import { useSmartUrlState } from '@/hooks/urlstate/useUrlState'
import { Event } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useMemo } from 'react'

type PreviousItemProps = {
	data: TeamEventData
}

export default function PreviousItem(props: PreviousItemProps) {
	const [openedEventGuid, setOpenedEventGuid] = useSmartUrlState(
		'teamPlaylists',
		'openedEvent'
	)
	const open = useMemo(
		() => openedEventGuid === props.data.guid,
		[openedEventGuid, props.data.guid]
	)

	const setOpen = (open: boolean) => {
		setOpenedEventGuid(open ? props.data.guid : null)
	}

	const date = new Date(props.data.date)

	return (
		// <Clickable>
		<Clickable>
			<Box
				sx={{
					// bgcolor: 'grey.300',
					paddingY: 1,
					paddingX: 1,
					borderRadius: 3,
					cursor: 'pointer',

					transition: 'all 0.3s ease',

					'&:hover': {
						bgcolor: 'grey.300',
						// paddingLeft: 1,
					},
				}}
				display={'flex'}
				flexDirection={'row'}
				gap={3}
				alignItems={'center'}
				onClick={() => setOpen(true)}
			>
				<Typography color="grey.700">{date.toLocaleDateString()}</Typography>

				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={2}
					alignItems={'center'}
				>
					{/* <Avatar /> */}
					<Event />
					<Box display={'flex'} flexDirection={'column'}>
						<Typography strong>{props.data.title}</Typography>

						<Typography color="grey.700">
							Vedoucí:{' '}
							{props.data.leader.firstName + ' ' + props.data.leader.lastName}
						</Typography>
					</Box>
				</Box>
			</Box>
			<TeamEventPopup
				open={open}
				onClose={() => setOpen(false)}
				data={{
					...props.data,
					date: date,
				}}
			/>
		</Clickable>
		// </Clickable>
	)
}
