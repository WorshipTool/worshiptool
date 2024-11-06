'use client'
import MenuItem from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/MenuItem'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
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

export default function Menu(props: MenuProps) {
	const { alias, guid } = useInnerTeam()
	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.change_base_info',
		{
			teamGuid: guid,
		}
	)

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
				disabled: true,
				hidden: true,
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
		[hasPermissionToEdit, alias]
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
		</Box>
	)
}
