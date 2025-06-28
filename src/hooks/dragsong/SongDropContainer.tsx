'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import {
	DragSongDto,
	getSongDataFromDragEvent,
	isDragObjectSong,
} from '@/hooks/dragsong/tech'
import { useCallback, useMemo, useState } from 'react'

type SongDropContainerProps = {
	children?: ((over?: boolean) => React.ReactNode) | React.ReactNode
	onDrop?: (song: DragSongDto, e: React.DragEvent<HTMLDivElement>) => void
	style?: React.CSSProperties
}

export default function SongDropContainer(props: SongDropContainerProps) {
	const [isOver, setIsOver] = useState(false)

	const { songGettingApi } = useApi()

	const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const isSong = isDragObjectSong(e)
		if (isSong) {
			setIsOver(true)
		}
	}, [])

	const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		// @ts-ignore
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setIsOver(false)
		}
	}, [])

	const onDrop = useCallback(
		async (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault()
			setIsOver(false)
			const song = await getSongDataFromDragEvent(e, songGettingApi)

			if (song) {
				props.onDrop?.(song, e)
			}
		},
		[props.onDrop, songGettingApi]
	)

	const component = useMemo(() => {
		return typeof props.children === 'function'
			? props.children(isOver)
			: props.children
	}, [props.children, isOver])

	return (
		<div
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			style={props.style}
		>
			{component}
		</div>
	)
}
