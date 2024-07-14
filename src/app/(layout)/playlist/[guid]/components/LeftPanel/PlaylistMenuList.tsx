'use client'
import PanelItem from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PanelItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import OnChangeDelayer from '@/common/providers/ChangeDelayer/ChangeDelayer'
import { PlaylistItemDTO } from '@/interfaces/playlist/PlaylistDTO'
import { Reorder } from 'framer-motion'
import { useState } from 'react'

type PlaylistMenuListProps = {
	items: PlaylistItemDTO[]
}

export default function PlaylistMenuList(props: PlaylistMenuListProps) {
	const [items, setItems] = useState<PlaylistItemDTO[]>(props.items)
	const { reorder } = useInnerPlaylist()

	const onReorder = (values: PlaylistItemDTO[]) => {
		setItems(values.map((v, i) => ({ ...v, order: i })))
	}
	return (
		<>
			<OnChangeDelayer
				value={items}
				onChange={(value) => {
					reorder(value.map((v, i) => ({ guid: v.guid, order: i })))
				}}
			/>
			<Reorder.Group
				values={items}
				onReorder={onReorder}
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
				{items.map((item) => {
					return (
						<Reorder.Item
							key={item.guid}
							value={item}
							as="div"
							style={{
								// width: '200px',
								// position: 'relative',
								paddingLeft: 5,
								paddingRight: 5,
							}}
						>
							<PanelItem item={item} moving={false} key={item.guid} />
							{/* <Gap /> */}
						</Reorder.Item>
					)
				})}
			</Reorder.Group>
		</>
	)
}
