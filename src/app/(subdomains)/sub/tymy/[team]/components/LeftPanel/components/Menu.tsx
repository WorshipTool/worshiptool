'use client'
import MenuItem from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/components/MenuItem'
import { Analytics, Dashboard, QueueMusic, Settings } from '@mui/icons-material'
import { Box } from '@mui/material'
import { ComponentProps, useMemo } from 'react'

type MenuItem = ComponentProps<typeof MenuItem>

type Props = {
	teamAlias: string
}

export default function Menu(props: Props) {
	const team = props.teamAlias
	const items: MenuItem[] = useMemo(
		() => [
			{
				title: 'Přehled',
				icon: <Dashboard />,
				to: 'team',
				toParams: { team },
			},
			{
				title: 'Seznam písní',
				icon: <QueueMusic />,
				to: 'teamSongbook',
				toParams: { team },
			},
			{
				title: 'Statistiky',
				icon: <Analytics />,
				to: 'teamStatistics',
				toParams: { team },
			},
			{
				title: 'Nastavení',
				icon: <Settings />,
				to: 'teamSettings',
				toParams: { team },
			},
		],
		[]
	)
	return (
		<Box padding={3} gap={1} display={'flex'} flexDirection={'column'}>
			{items.map((item, index) => (
				<MenuItem key={index} {...item} />
			))}
		</Box>
	)
}
