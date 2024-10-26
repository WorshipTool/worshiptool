'use client'
import { TeamEventData } from '@/api/generated'
import TeamEventPopup from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/EventPopup/TeamEventPopup'
import { Clickable } from '@/common/ui/Clickable'
import { Typography } from '@/common/ui/Typography'
import { useSmartUrlState } from '@/hooks/urlstate/useUrlState'
import { Box, useTheme } from '@mui/material'
import { useMemo } from 'react'

type NextMonthItemProps = {
	data: TeamEventData
}

export default function NextMonthItem(props: NextMonthItemProps) {
	const [openedEventGuid, setOpenedEventGuid] = useSmartUrlState(
		'teamPlaylists',
		'openedEvent'
	)
	const open = useMemo(
		() => openedEventGuid === props.data.guid,
		[openedEventGuid, props.data.guid]
	)
	const theme = useTheme()

	const setOpen = (open: boolean) => {
		setOpenedEventGuid(open ? props.data.guid : null)
	}

	const date = new Date(props.data.date)

	return (
		<>
			<Clickable onClick={() => setOpen(true)}>
				<Box
					sx={{
						width: theme.spacing(22),
						aspectRatio: '3/2',
						bgcolor: 'grey.100',
						borderRadius: 3,
						position: 'relative',
						overflow: 'hidden',
						border: '1px solid',
						borderColor: 'grey.400',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							left: theme.spacing(3),
							top: theme.spacing(3),
							right: theme.spacing(3),
							bottom: theme.spacing(3),
							gap: 1,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Typography strong>{props.data.title}</Typography>
						{/* <CalendarMonth
								color="inherit"
								sx={{
									color: 'grey.700',
								}}
							/> */}
						<Typography color="grey.700">
							{date.toLocaleDateString()}
						</Typography>
					</Box>

					<Box
						sx={{
							height: 30,
							bgcolor: 'secondary.main',
							position: 'absolute',
							bottom: 0,
							right: 0,
							left: 0,
							transform: 'translateY(0%) translateX(50%) rotate(-45deg)',
						}}
					></Box>
				</Box>
			</Clickable>
			<TeamEventPopup
				open={open}
				onClose={() => setOpen(false)}
				data={{
					...props.data,
					date: new Date(props.data.date),
				}}
			/>
		</>
	)
}
