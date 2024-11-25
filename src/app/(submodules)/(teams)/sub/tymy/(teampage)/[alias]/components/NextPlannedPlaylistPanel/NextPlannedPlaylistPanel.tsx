'use client'

import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Box } from '@/common/ui'
import { Clickable } from '@/common/ui/Clickable'
import { Gap } from '@/common/ui/Gap'
import { IconButton } from '@/common/ui/IconButton'
import { Link } from '@/common/ui/Link/Link'
import { Chip } from '@/common/ui/mui'
import { Typography } from '@/common/ui/Typography'
import {
	isDateToday,
	isDateTodayOrInFuture,
	isDateTomorrow,
} from '@/tech/date/date.tech'
import { CalendarMonth, KeyboardArrowRight } from '@mui/icons-material'
import { useMemo } from 'react'

export default function NextPlannedPlaylistPanel() {
	const {
		events: { events },
		alias,
	} = useInnerTeam()

	// find the closest event in the future
	const closestEvent = useMemo(() => {
		if (events.length === 0) return null

		const now = new Date()
		const e = events.reduce((closest, current) => {
			const closestDate = new Date(closest.date)
			const currentDate = new Date(current.date)
			if (!isDateTodayOrInFuture(currentDate, now)) return closest
			return currentDate < closestDate ? current : closest
		}, events[0])

		// return e only if date is today or in the future
		if (isDateTodayOrInFuture(new Date(e.date), now)) return e
		return null
	}, [events])

	const dateString = closestEvent
		? isDateToday(new Date(closestEvent.date))
			? 'Dnes'
			: isDateTomorrow(new Date(closestEvent.date))
			? 'Zítra'
			: new Date(closestEvent.date).toLocaleDateString(undefined, {
					day: 'numeric',
					month: 'long',
			  })
		: null

	return !closestEvent ? null : (
		<>
			<Typography strong>Nejbližší naplánovaný playlist</Typography>
			<Gap />
			<Link
				to="teamPlaylist"
				params={{
					alias,
					guid: closestEvent.playlist.guid,
				}}
			>
				<Clickable>
					<TeamCard>
						<Box
							display={'flex'}
							flexDirection={'row'}
							alignItems={'center'}
							gap={2}
						>
							<Box>
								<CalendarMonth />
							</Box>
							<Box>
								<Box display={'flex'} flexDirection={'row'} gap={1}>
									<Typography strong>{closestEvent.title}</Typography>
								</Box>
								<Typography>{closestEvent.playlist.title}</Typography>
							</Box>
							<Gap />
							<Chip label={dateString} size="small" />
							<IconButton
								tooltip="Zobrazit detail"
								to="teamPlaylists"
								toParams={{
									alias,
									openedEvent: closestEvent.guid,
								}}
							>
								<KeyboardArrowRight />
							</IconButton>
						</Box>
					</TeamCard>
				</Clickable>
			</Link>
		</>
	)
}
