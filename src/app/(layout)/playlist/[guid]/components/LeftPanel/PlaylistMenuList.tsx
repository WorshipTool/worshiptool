'use client'
import PanelItem from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PanelItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Typography } from '@/common/ui/Typography'
import { PlaylistItemDto } from '@/interfaces/playlist/playlist.types'
import { Reorder } from 'framer-motion'

type PlaylistMenuListProps = {}

export default function PlaylistMenuList(props: PlaylistMenuListProps) {
	const { items, loading, setItems } = useInnerPlaylist()
	// const { reorder } = useInnerPlaylist()

	const onReorder = (values: PlaylistItemDto[]) => {
		setItems(values.map((v, i) => ({ ...v, order: i })))
	}
	return (
		<>
			{loading || !items ? (
				<>
					<Typography>Načítání...</Typography>
				</>
			) : (
				<>
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
			)}
		</>
	)
}
