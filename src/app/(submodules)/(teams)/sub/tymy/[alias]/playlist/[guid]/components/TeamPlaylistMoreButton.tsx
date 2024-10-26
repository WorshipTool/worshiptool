'use client'
import { TeamEventData } from '@/api/generated'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import TeamEventPopup, {
	TeamEventPopupData,
} from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/EventPopup/TeamEventPopup'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import Menu from '@/common/components/Menu/Menu'
import { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { IconButton } from '@/common/ui/IconButton'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { CalendarMonth, EditCalendar, MoreHoriz } from '@mui/icons-material'
import { useState } from 'react'

export default function TeamPlaylistMoreButton() {
	const { title, guid } = useInnerPlaylist()
	const { guid: teamGuid } = useInnerTeam()

	const { teamEventsApi } = useApi()
	const [apiState, reload] =
		useApiStateEffect<TeamEventData | null>(async () => {
			if (!guid) return null
			return handleApiCall(
				teamEventsApi.teamEventControllerGetEventByPlaylist(guid)
			)
		}, [guid])

	const hasEvent = Boolean(apiState.data)

	const [menuOpen, setMenuOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)
	const onClick = (e: React.MouseEvent) => {
		setAnchor(e.currentTarget as HTMLElement)
		setMenuOpen(true)
	}

	const [eventOpen, setEventOpen] = useState(false)

	const onPlanClick = () => {
		setMenuOpen(false)
		setEventOpen(true)
	}

	const eventData: TeamEventPopupData | null = apiState.data
		? {
				title: apiState.data.title,
				date: new Date(apiState.data.date),
				description: apiState.data?.description,
				guid: apiState.data.guid,
				playlist: {
					guid,
					title,
				},
				leader: apiState.data.leader,
				members: apiState.data.members,
		  }
		: null

	const hasPermissionToAdd = usePermission<TeamPermissions>('team.add_event', {
		teamGuid,
	})

	const onSubmit = () => {
		reload()
	}

	const items: MenuItemObjectType[] = [
		...(hasEvent
			? [
					{
						title: 'Zobrazit událost',
						subtitle: 'Detail události',
						icon: <EditCalendar />,
						onClick: onPlanClick,
						disabled: apiState.loading,
					},
			  ]
			: !hasPermissionToAdd
			? []
			: [
					{
						title: 'Naplánovat',
						subtitle: 'Naplánovat playlist',
						icon: <CalendarMonth />,
						onClick: onPlanClick,
						disabled: apiState.loading,
					},
			  ]),
	]
	return (
		<>
			{items.length > 0 && (
				<IconButton onClick={onClick}>
					<MoreHoriz />
				</IconButton>
			)}

			{hasEvent && (
				<IconButton onClick={onPlanClick} tooltip={'Zobrazit detail události'}>
					<EditCalendar />
				</IconButton>
			)}

			<Menu
				open={menuOpen}
				anchor={anchor}
				onClose={() => setMenuOpen(false)}
				items={items}
			/>

			{!hasEvent ? (
				<TeamEventPopup
					open={eventOpen}
					onClose={() => setEventOpen(false)}
					onSubmit={onSubmit}
					onDelete={onSubmit}
					createMode
					editable
					data={{
						title: title,
						playlist: {
							guid,
							title,
						},
					}}
					lockPlaylist
				/>
			) : (
				<TeamEventPopup
					open={eventOpen}
					onClose={() => setEventOpen(false)}
					onSubmit={onSubmit}
					onDelete={onSubmit}
					data={eventData || undefined}
					lockPlaylist
					hideOpenPlaylistButton
				/>
			)}
		</>
	)
}
