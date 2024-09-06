import {
	EVENT_NAME_SONG_DRAG_END,
	EVENT_NAME_SONG_DRAG_START,
} from '@/hooks/dragsong/constants'
import { isDragObjectSong } from '@/hooks/dragsong/tech'
import React, { useRef } from 'react'

type SongDragProviderProps = {
	children: React.ReactNode
}

export default function SongDragProvider(props: SongDragProviderProps) {
	const isDragging = useRef(false)
	const set = (value: boolean) => {
		if (value === isDragging.current) return
		isDragging.current = value
		if (value) {
			window.dispatchEvent(new Event(EVENT_NAME_SONG_DRAG_START))
		} else {
			window.dispatchEvent(new Event(EVENT_NAME_SONG_DRAG_END))
		}
	}

	const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		const isSong = isDragObjectSong(e)
		if (isSong) {
			e.preventDefault()
			set(true)
		}
	}

	const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		// @ts-ignore
		if (e.relatedTarget === null || e.relatedTarget.nodeName === 'HTML') {
			set(false)
		}
	}

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		set(false)
	}

	return (
		<div onDragOver={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
			{props.children}
		</div>
	)
}
