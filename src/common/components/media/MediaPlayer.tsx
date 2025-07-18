import SpotifyPlayer from '@/common/components/media/SpotifyPlayer'
import YoutubeVideo from '@/common/components/media/YoutubeVideo'
import { Box, Typography } from '@/common/ui'
import { MediaTypes } from '@/types/song/media.types'

type Props = {
	src: string
	type?: MediaTypes

	spotify?: boolean
	youtube?: boolean

	maxHeight?: string
}
export default function MediaPlayer(props: Props) {
	const type = props.spotify
		? MediaTypes.Spotify
		: props.youtube
		? MediaTypes.Youtube
		: props.type ?? null

	return (
		<Box maxWidth={'560px'} maxHeight={props.maxHeight}>
			{type === MediaTypes.Youtube ? (
				<YoutubeVideo
					url={props.src}
					key={props.src}
					maxHeight={props.maxHeight}
				></YoutubeVideo>
			) : type === MediaTypes.Spotify ? (
				<SpotifyPlayer url={props.src} key={props.src}></SpotifyPlayer>
			) : (
				<Typography key={props.src}>
					Našli jsme přílohu, ale nevíme jak si s ní poradit.
				</Typography>
			)}
		</Box>
	)
}
