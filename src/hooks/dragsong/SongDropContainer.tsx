import { isDragObjectSong } from '@/hooks/dragsong/tech'
import { useCallback, useMemo, useState } from 'react'

type SongDropContainerProps = {
	children?: (over?: boolean) => React.ReactNode
}

export default function SongDropContainer(props: SongDropContainerProps) {
	const [isOver, setIsOver] = useState(false)

	const onDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		const isSong = isDragObjectSong(e)
		if (isSong) {
			e.preventDefault()
			setIsOver(true)
		}
	}, [])

	const onDragEnd = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(false)
	}, [])

	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsOver(false)
	}, [])

	const component = useMemo(() => {
		return props.children?.(isOver)
	}, [props.children, isOver])

	return (
		<div onDragEnter={onDrag} onDragLeave={onDragEnd} onDrop={onDrop}>
			{component}
		</div>
	)
}
