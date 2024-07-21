import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'

export default function PresentationButton() {
	const { guid, save } = useInnerPlaylist()
	return (
		<>
			<Button
				size="small"
				variant="outlined"
				to="playlistCards"
				toParams={{ guid }}
				onClick={save}
			>
				Prezentace
			</Button>
		</>
	)
}
