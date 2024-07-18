'use client'
import PanelItem from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PanelItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import {
	PlaylistItemDto,
	PlaylistItemGuid,
} from '@/interfaces/playlist/playlist.types'
import { Reorder } from 'framer-motion'
import { useMemo } from 'react'

type PlaylistMenuListProps = {}

export default function PlaylistMenuList(props: PlaylistMenuListProps) {
	const { items, loading, setItems } = useInnerPlaylist()

	const onReorder = (values: PlaylistItemGuid[], items: PlaylistItemDto[]) => {
		const newItems = values.map((guid, i) => {
			const item = items.find((i) => i.guid === guid)!
			item.order = i
			return item
		})
		setItems(newItems)
	}

	const itemGuids = useMemo(() => items?.map((i) => i.guid), [items])

	return (
		<>
			{loading || !items ? (
				<>
					<Typography>Načítání...</Typography>
				</>
			) : (
				<>
					{items.length === 0 && (
						<>
							<Gap />
							<Typography>V playlistu nejsou žádné písně...</Typography>
						</>
					)}
					<Reorder.Group
						values={itemGuids}
						onReorder={(values) => onReorder(values, items)}
						axis="y"
						style={{
							padding: 0,
							position: 'relative',
							width: '100%',
							gap: '8px',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						{itemGuids?.map((item, index) => {
							return (
								<Reorder.Item
									key={item}
									value={item}
									as="div"
									style={{
										paddingLeft: 5,
										paddingRight: 5,
									}}
								>
									<PanelItem itemGuid={item} key={item} itemIndex={index} />
								</Reorder.Item>
							)
						})}
					</Reorder.Group>
				</>
			)}
		</>
	)
}
