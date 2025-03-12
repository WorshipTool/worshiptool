import MediaPlayer from '@/common/components/media/MediaPlayer'
import { MediaData } from '@/types/song/media.types'

type Props = {
	media: MediaData[]
}
export default function MediaSection(props: Props) {
	return props.media.map((m) => (
		<MediaPlayer src={m.url} type={m.type} key={m.guid} />
	))
}
