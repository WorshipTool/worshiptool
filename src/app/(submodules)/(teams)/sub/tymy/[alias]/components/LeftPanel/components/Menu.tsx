'use client'
import MenuItem from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/MenuItem'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { usePermission } from '@/hooks/permissions/usePermission'
import {
	Analytics,
	Dashboard,
	People,
	QueueMusic,
	Settings,
} from '@mui/icons-material'
import { Box } from '@mui/material'
import { ComponentProps, useMemo } from 'react'

type MenuItem = ComponentProps<typeof MenuItem>

export default function Menu() {
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
				title: 'Statistiky',
				icon: <Analytics />,
				to: 'teamStatistics',
				toParams: { alias },
				disabled: true,
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
		<Box padding={3} gap={1} display={'flex'} flexDirection={'column'}>
			{items.map((item, index) => (
				<MenuItem key={index} {...item} />
			))}
		</Box>
	)
}
