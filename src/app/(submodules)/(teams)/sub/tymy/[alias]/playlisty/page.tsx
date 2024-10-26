'use client'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import NextMonthPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlisty/components/NextMonthPanel'
import OtherPlaylistPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlisty/components/OtherPlaylistPanel'
import PreviousPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlisty/components/PreviousPanel'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Gap } from '@/common/ui/Gap'
import { isDateTodayOrInFuture } from '@/tech/date/date.tech'
import { Box } from '@mui/material'
import { useMemo } from 'react'

export default SmartTeamPage(Page, {})

function Page() {
	const {
		guid: teamGuid,
		events: { events, apiState, addEvent },
	} = useInnerTeam()

	const futureEvents = useMemo(() => {
		const now = new Date()
		return events.filter((e) => isDateTodayOrInFuture(new Date(e.date), now))
	}, [events])
	const pastEvents = useMemo(() => {
		const now = new Date()
		return events.filter((e) => !isDateTodayOrInFuture(new Date(e.date), now))
	}, [events])

	return (
		<Box>
			<TeamPageTitle>Playlisty</TeamPageTitle>

			<NextMonthPanel
				events={futureEvents}
				loading={apiState.loading}
				allEventsCount={events.length}
			/>
			<Gap value={3} />
			<Box display={'flex'} flexDirection={'row'} gap={4} flexWrap={'wrap'}>
				<Box flex={1}>
					<PreviousPanel events={pastEvents} loading={apiState.loading} />
				</Box>
				<Box flex={1}>
					<OtherPlaylistPanel />
				</Box>
			</Box>
		</Box>
	)
}
