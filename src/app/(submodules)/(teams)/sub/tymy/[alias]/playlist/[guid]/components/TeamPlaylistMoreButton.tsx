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
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useApiState, useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import {
	CalendarMonth,
	Delete,
	EditCalendar,
	Info,
	MoreHoriz,
} from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useMemo, useState } from 'react'

export default function TeamPlaylistMoreButton() {
	const { title, guid: playlistGuid } = useInnerPlaylist()
	const { guid: teamGuid } = useInnerTeam()

	const { teamEventsApi } = useApi()
	const [apiState, reload] =
		useApiStateEffect<TeamEventData | null>(async () => {
			if (!playlistGuid) return null
			return handleApiCall(
				teamEventsApi.teamEventControllerGetEventByPlaylist(playlistGuid)
			)
		}, [playlistGuid])

	const hasEvent = useMemo(() => Boolean(apiState.data), [apiState.data])

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
					guid: playlistGuid,
					title,
				},
				leader: apiState.data.leader,
				members: apiState.data.members,
		  }
		: null

	const hasPermissionToAdd = usePermission<TeamPermissions>('team.add_event', {
		teamGuid,
	})

	const hasPermissionToDeletePlaylist = true

	const onSubmit = () => {
		reload()
	}

	const canBeDeleted = !hasEvent
	const router = useRouter()
	const { playlistEditingApi } = useApi()
	const { apiState: deletingApiState, fetchApiState: fetchDelete } =
		useApiState<boolean>()
	const [deleteOpen, setDeleteOpen] = useState(false)
	const onRemove = async () => {
		await fetchDelete(
			async () => {
				return handleApiCall(
					playlistEditingApi.playlistEditingControllerDeletePlaylist(
						playlistGuid
					)
				)
			},
			(d) => {
				if (d) {
					enqueueSnackbar('Playlist byla smazán')
					// Go back
					router.back()
				}
			}
		)
		setDeleteOpen(false)
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
		...(hasPermissionToDeletePlaylist
			? [
					{
						title: <Typography color="error">Odstranit</Typography>,
						subtitle: 'Smazat playlist',
						icon: <Delete color="error" />,
						onClick: () => {
							setDeleteOpen(true)
							setMenuOpen(false)
						},
					},
			  ]
			: []),
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
							guid: playlistGuid,
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

			<Popup
				title={canBeDeleted ? 'Smazat playlist?' : 'Nelze smazat playlist'}
				icon={!canBeDeleted ? <Info /> : undefined}
				// subtitle="Opravdu chcete smazat playlist?"
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				width={400}
				actions={
					canBeDeleted
						? [
								<Button
									variant="text"
									color="error"
									onClick={onRemove}
									loading={deletingApiState.loading}
								>
									Smazat
								</Button>,
								<Button type="reset" disabled={deletingApiState.loading}>
									Zrušit
								</Button>,
						  ]
						: [<Box />, <Button type="reset">Zavřít</Button>]
				}
			>
				{canBeDeleted ? (
					<Typography>
						Opravdu chcete smazat playlist? Tato akce je nevratná.
					</Typography>
				) : (
					<Typography>
						Nelze smazat naplánovaný playlist. Pokud chcete pokračovat, nejprve
						smažte naplánovanou událost.
					</Typography>
				)}
			</Popup>
		</>
	)
}
