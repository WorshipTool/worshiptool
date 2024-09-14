import { useApi } from '@/hooks/api/useApi'
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
	const { songGettingApi } = useApi()

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

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		const isSong = isDragObjectSong(e)
		if (isSong) {
			set(true)
		}
		e.preventDefault()
	}

	const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		// @ts-ignore
		if (e.relatedTarget === null || e.relatedTarget.nodeName === 'HTML') {
			set(false)
		}
	}

	const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		// const url = e.dataTransfer.getData('text/uri-list')
		// const o = await getSongDataFromDragEvent(e, songGettingApi)
		e.preventDefault()
		set(false)

		// if (!o) {
		// 	if (url) {
		// 		window.open(url, '_blank')
		// 	}
		// }
	}

	return (
		<div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
			{props.children}
		</div>
	)
}
