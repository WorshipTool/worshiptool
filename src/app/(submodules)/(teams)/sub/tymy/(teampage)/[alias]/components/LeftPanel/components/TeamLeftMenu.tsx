'use client'
import MenuItem from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/components/MenuItem'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import {
	TeamMemberRole,
	TeamPermissions,
} from '@/app/(submodules)/(teams)/sub/tymy/tech'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Box } from '@/common/ui'
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

type MenuProps = {
	collapsed: boolean
	transition: string
}

export default function TeamLeftMenu(props: MenuProps) {
	const {
		alias,
		guid,
		events: { events },
		members: { me },
	} = useInnerTeam()
	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.change_base_info',
		{
			teamGuid: guid,
		}
	)

	const showStatistics =
		events.length >= 10 && me?.role === TeamMemberRole.MANAGER

	const items: MenuItem[] = useMemo(
		() => [
			{
				title: 'Přehled',
				icon: <Dashboard />,
				to: 'team',
				toParams: { alias },
			},
			{
				title: 'Seznam písní',
				icon: <QueueMusic />,
				to: 'teamSongbook',
				toParams: { alias },
			},
			{
				title: 'Playlisty',
				icon: <Subscriptions />,
				to: 'teamPlaylists',
				toParams: { alias },
			},
			{
				title: 'Statistiky',
				icon: <Analytics />,
				to: 'teamStatistics',
				toParams: { alias },
				// disabled: true,
				hidden: !showStatistics,
			},
			{
				title: 'Lidé',
				icon: <People />,
				to: 'teamPeople',
				toParams: { alias },
			},
			{
				title: 'Nastavení',
				icon: <Settings />,
				to: 'teamSettings',
				toParams: { alias },
				hidden: !hasPermissionToEdit,
			},
		],
		[hasPermissionToEdit, alias, showStatistics]
	)
	return (
		<Box
			paddingX={props.collapsed ? 0 : 3}
			paddingY={3}
			sx={{
				transition: props.transition,
			}}
			gap={1}
			display={'flex'}
			flexDirection={'column'}
			maxWidth={props.collapsed ? 45 : 200}
		>
			{items.map((item, index) => (
				<MenuItem key={index} {...item} collapsed={props.collapsed} />
			))}

			{!showStatistics && (
				<OnlyAdmin notCollapse>
					<MenuItem
						title="Statistiky"
						icon={<Analytics />}
						to="teamStatistics"
						toParams={{ alias }}
					/>
				</OnlyAdmin>
			)}
		</Box>
	)
}
