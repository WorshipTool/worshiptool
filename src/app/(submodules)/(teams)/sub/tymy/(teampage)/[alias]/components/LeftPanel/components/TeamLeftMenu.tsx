'use client'
import MenuItem from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/components/MenuItem'
import { useTeamLeftMenuItems } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/hooks/useTeamLeftMenuItems'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Box } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { ComponentProps } from 'react'

type MenuItem = ComponentProps<typeof MenuItem>

type MenuProps = {
	collapsed: boolean
	transition: string
}

export default function TeamLeftMenu(props: MenuProps) {
	const {
		alias,
		members: { me },
		isCreator,
	} = useInnerTeam()
	const navigate = useSmartNavigate()

	const items = useTeamLeftMenuItems()
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
