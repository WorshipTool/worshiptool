'use client'
import { TeamEventData } from '@/api/generated'
import TeamEventPopup from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/EventPopup/TeamEventPopup'
import { Clickable } from '@/common/ui/Clickable'
import { Typography } from '@/common/ui/Typography'
import { Box, useTheme } from '@mui/material'
import { useState } from 'react'

type NextMonthItemProps = {
	data: TeamEventData
}

export default function NextMonthItem(props: NextMonthItemProps) {
	const [open, setOpen] = useState(false)
	const theme = useTheme()

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
