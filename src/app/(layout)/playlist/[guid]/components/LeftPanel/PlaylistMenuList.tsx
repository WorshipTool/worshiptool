'use client'
import PanelItem from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PanelItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { Reorder } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type PlaylistMenuListProps = {}

export default function PlaylistMenuList(props: PlaylistMenuListProps) {
	const { items, loading, setItems } = useInnerPlaylist()

	const [innerGuids, setInnerGuids] = useState<PlaylistItemGuid[]>(
		items?.map((i) => i.guid) || []
	)

	const startReordering = useRef(false)

	useEffect(() => {
		if (items) {
			setInnerGuids(items.map((i) => i.guid))
		}
	}, [items])

	useEffect(() => {
		const handleMouseUp = () => {
			if (startReordering.current) {
				const itemsCopy = [...items]
				const newItems = innerGuids.map((guid, i) => {
					const rawItem = itemsCopy.find((i) => i.guid === guid)!
					const item = { ...rawItem }

					item.order = i

					return item
				})
				setItems(newItems)

				startReordering.current = false
			}
		}

		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [innerGuids, items, setItems, startReordering])

	const onReorder = (values: PlaylistItemGuid[]) => {
		setInnerGuids(values)
		startReordering.current = true
	}

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
						values={innerGuids}
						onReorder={(values) => onReorder(values)}
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
						{innerGuids?.map((item, index) => {
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
