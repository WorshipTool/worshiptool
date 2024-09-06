import {
	DragSongDto,
	getSongDataFromDragEvent,
	isDragObjectSong,
} from '@/hooks/dragsong/tech'
import { useCallback, useMemo, useState } from 'react'

type SongDropContainerProps = {
	children?: ((over?: boolean) => React.ReactNode) | React.ReactNode
	onDrop?: (song: DragSongDto, e: React.DragEvent<HTMLDivElement>) => void
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
		// @ts-ignore
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setIsOver(false)
		}
	}, [])

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault()
			setIsOver(false)
			const song = getSongDataFromDragEvent(e)

			if (song) {
				props.onDrop?.(song, e)
			}
		},
		[props.onDrop]
	)

	const component = useMemo(() => {
		return typeof props.children === 'function'
			? props.children(isOver)
			: props.children
	}, [props.children, isOver])

	return (
		<div onDragEnter={onDrag} onDragLeave={onDragEnd} onDrop={onDrop}>
			{component}
		</div>
	)
}
