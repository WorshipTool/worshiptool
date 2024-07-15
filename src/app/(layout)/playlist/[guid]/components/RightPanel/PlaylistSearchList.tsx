import { Masonry } from '@mui/lab'
import { useTheme } from '@mui/material'
import { SongVariantDto } from '../../../../../../api/dtos'
import Playlist from '../../../../../../interfaces/playlist/playlist.types'
import SearchItem from './SearchItem'

interface PlaylistSearchListProps {
	variants: SongVariantDto[]
	playlist: Playlist
}

export default function PlaylistSearchList({
	variants,
	playlist,
}: PlaylistSearchListProps) {
	const theme = useTheme()
	const spacing = 1
	return variants.length == 0 ? (
		<></>
	) : (
		<Masonry
			columns={1}
			sx={{
				marginLeft: -(spacing / 2),
				width: `calc(100% + ${theme.spacing(spacing)})`,
			}}
			spacing={spacing}
		>
			{variants.map((v) => {
				return (
					<SearchItem variant={v} key={v.guid} playlist={playlist}></SearchItem>
				)
			})}
		</Masonry>
	)
}
