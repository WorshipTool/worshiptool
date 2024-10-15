import { PlaylistItem } from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/PlaylistItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Box } from '@mui/material'
import { useMemo } from 'react'

export default function TeamPlaylistMiddlePanel() {
	const { items, loading } = useInnerPlaylist()

	const itemsArr = useMemo(
		() =>
			items
				?.sort((a, b) => {
					return a.order - b.order
				})
				.map((item, index) => (
					// <div key={item.guid}>ahoj{item.guid}</div>
					<PlaylistItem key={item.guid} itemGuid={item.guid} />
				)),
		[items]
	)

	return (
		<Box flex={1} position={'relative'} padding={2} paddingRight={4}>
			{loading || !items ? <>Načítání...</> : <>{itemsArr}</>}
		</Box>
	)
}
