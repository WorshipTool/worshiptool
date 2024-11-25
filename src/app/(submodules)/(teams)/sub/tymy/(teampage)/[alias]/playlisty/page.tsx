'use client'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import NextMonthPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlisty/components/NextMonthPanel'
import PinnedPlaylistsPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlisty/components/PinnedPlaylistsPanel'
import PreviousPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlisty/components/PreviousPanel'
import UsersTeamPlaylistsPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlisty/components/UsersTeamPlaylistsPanel'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Box } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'
import { isDateTodayOrInFuture } from '@/tech/date/date.tech'
import { useMemo } from 'react'

export default SmartTeamPage(Page, {})

function Page() {
	const {
		guid: teamGuid,
		events: { events, apiState, addEvent },
	} = useInnerTeam()

	const futureEvents = useMemo(() => {
		const now = new Date()
		return events
			.filter((e) => isDateTodayOrInFuture(new Date(e.date), now))
			.sort((a, b) => {
				return new Date(a.date).getTime() - new Date(b.date).getTime()
			})
	}, [events])
	const pastEvents = useMemo(() => {
		const now = new Date()
		return events
			.filter((e) => !isDateTodayOrInFuture(new Date(e.date), now))
			.sort((a, b) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime()
			})
	}, [events])

	return (
		<Box display={'flex'} flexDirection={'column'} gap={3}>
			<TeamPageTitle>Playlisty</TeamPageTitle>

			{/* Your recent playlists */}
			<UsersTeamPlaylistsPanel />

			<Box display={'flex'} flexDirection={'row'} gap={4} flexWrap={'wrap'}>
				<Box flex={1}>
					<NextMonthPanel
						events={futureEvents}
						loading={apiState.loading}
						allEventsCount={events.length}
					/>
					<Gap value={3} />
					<PinnedPlaylistsPanel />
				</Box>
				<Box>
					<PreviousPanel events={pastEvents} loading={apiState.loading} />
				</Box>
			</Box>
		</Box>
	)
}
