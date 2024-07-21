import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'

export default function PresentationButton() {
	const { guid } = useInnerPlaylist()
	return (
		<>
			<Button
				size="small"
				variant="outlined"
				to="playlistCards"
				toParams={{ guid }}
			>
				Prezentace
			</Button>
		</>
	)
}
