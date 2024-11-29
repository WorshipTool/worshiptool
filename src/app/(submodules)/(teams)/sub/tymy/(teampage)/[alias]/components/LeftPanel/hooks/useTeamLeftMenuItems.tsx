import MenuItem from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/components/MenuItem'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import {
	TeamMemberRole,
	TeamPermissions,
} from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { usePermission } from '@/hooks/permissions/usePermission'
import {
	Analytics,
	Dashboard,
	People,
	QueueMusic,
	Settings,
	Subscriptions,
} from '@mui/icons-material'
import { ComponentProps, useMemo } from 'react'

type MenuItem = ComponentProps<typeof MenuItem>

export const useTeamLeftMenuItems = () => {
	const {
		alias,
		guid,
		events: { events },
		members: { me },
		isCreator,
	} = useInnerTeam()
	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.change_base_info',
		{
			teamGuid: guid,
		}
	)

	const isManager = me?.role === TeamMemberRole.MANAGER || isCreator

	const showStatistics = events.length >= 10 && isManager

	const showPeople = isManager

	const items: MenuItem[] = useMemo(
		() => [
			{
				title: 'Přehled',
				icon: <Dashboard />,
				to: 'team',
				toParams: { alias },
				id: 'overview',
			},
			{
				title: 'Seznam písní',
				icon: <QueueMusic />,
				to: 'teamSongbook',
				toParams: { alias },
				id: 'songlist',
			},
			{
				title: 'Playlisty',
				icon: <Subscriptions />,
				to: 'teamPlaylists',
				toParams: { alias },
				id: 'playlists',
			},
			{
				title: 'Statistiky',
				icon: <Analytics />,
				to: 'teamStatistics',
				toParams: { alias },
				// disabled: true,
				hidden: !showStatistics,
				id: 'statistics',
			},
			{
				title: 'Lidé',
				icon: <People />,
				to: 'teamPeople',
				toParams: { alias },
				hidden: !showPeople,
				id: 'people',
			},
			{
				title: 'Nastavení',
				icon: <Settings />,
				to: 'teamSettings',
				toParams: { alias },
				hidden: !hasPermissionToEdit,
				id: 'settings',
			},
		],
		[hasPermissionToEdit, alias, showStatistics]
	)

	return items
}
