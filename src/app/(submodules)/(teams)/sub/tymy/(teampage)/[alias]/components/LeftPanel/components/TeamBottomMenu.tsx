import MenuItem, {
	TeamBarMenuTypes,
} from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/components/MenuItem'
import { useTeamLeftMenuItems } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/hooks/useTeamLeftMenuItems'
import { Box, IconButton } from '@/common/ui'
import { ComponentProps } from 'react'

type MenuItem = ComponentProps<typeof MenuItem>

type ItemType = TeamBarMenuTypes
export default function TeamBottomMenu() {
	const items = useTeamLeftMenuItems()

	const getItem = (t: ItemType): MenuItem | null => {
		return items.find((item) => item.id === t) || null
	}

	const Item = ({ item }: { item: ItemType }) => {
		const data = getItem(item)
		return data ? (
			<Box>
				<IconButton color="inherit" to={data.to} toParams={data.toParams}>
					{data.icon}
				</IconButton>
			</Box>
		) : null
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-around',
				alignItems: 'center',
			}}
		>
			<Item item={'playlists'} />
			<Item item={'overview'} />
			<Item item={'songlist'} />
		</Box>
	)
}
