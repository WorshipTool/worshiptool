import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'
import { RoutesKeys, SmartAllParams } from '@/routes'

type PresentationButtonProps<T extends RoutesKeys> = {
	to: T
	toParams: SmartAllParams<T>
}

export default function PresentationButton<T extends RoutesKeys>(
	props: PresentationButtonProps<T>
) {
	const { guid, save, items } = useInnerPlaylist()
	return (
		<>
			<Button
				size="small"
				variant="outlined"
				to={props.to}
				toParams={props.toParams}
				onClick={save}
				disabled={items.length === 0}
			>
				Prezentace
			</Button>
		</>
	)
}
