import { PlaylistItem } from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/PlaylistItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import CannotEditOnPhone from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlist/[guid]/components/CannotEditOnPhone'
import { Box } from '@/common/ui'
import { useMemo } from 'react'

export default function MiddlePanel() {
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
		<Box
			flex={1}
			padding={2}
			position={'relative'}
			className="playlist-middle-song-list"
		>
			<CannotEditOnPhone />
			{loading || !items ? <>Načítání...</> : <>{itemsArr}</>}
		</Box>
	)
}
