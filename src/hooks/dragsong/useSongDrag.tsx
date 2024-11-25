import {
	EVENT_NAME_SONG_DRAG_END,
	EVENT_NAME_SONG_DRAG_START,
} from '@/hooks/dragsong/constants'
import { useEffect, useState } from 'react'

export default function useSongDrag() {
	const [isDragging, setIsDragging] = useState(false)
	const onDragStart = () => {
		setIsDragging(true)
	}

	const onDragEnd = () => {
		setIsDragging(false)
	}

	useEffect(() => {
		window.addEventListener(EVENT_NAME_SONG_DRAG_START, onDragStart)
		window.addEventListener(EVENT_NAME_SONG_DRAG_END, onDragEnd)

		return () => {
			window.removeEventListener(EVENT_NAME_SONG_DRAG_START, onDragStart)
			window.removeEventListener(EVENT_NAME_SONG_DRAG_END, onDragEnd)
		}
	}, [])

	return {
		onDragStart,
        
		onDragEnd,
		isDragging,
	}
}
