import SongCardDragTemplate from '@/common/ui/SongCard/SongCardDragTemplate'
import { DragSongDto, SONG_DRAG_DATA_TYPE } from '@/hooks/dragsong/tech'
import { getRouteUrlWithParams, parseVariantAlias } from '@/routes/routes.tech'
import React, {
	DragEventHandler,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'

type DraggableSongProps = {
	children: React.ReactNode | ((dragging: boolean) => React.ReactNode)
	draggable?: boolean

	data: DragSongDto
	style?: React.CSSProperties
}

export default function DraggableSong({
	draggable = true,
	...props
}: DraggableSongProps) {
	const img = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)

	const title = useMemo(() => {
		return props.data.title
	}, [props.data.title])

	const onDragStart: DragEventHandler<HTMLDivElement> = useCallback(
		(e) => {
			setDragging(true)
			if (!img.current) return
			e.dataTransfer.setDragImage(img.current, 50, 50)

			// set url to data
			const url = getRouteUrlWithParams(
				'variant',
				parseVariantAlias(props.data.alias)
			)
			e.dataTransfer.setData('text/uri-list', url)
			e.dataTransfer.setData('text/plain', title)

			const data: DragSongDto = {
				packGuid: props.data.packGuid,
				alias: props.data.alias,
				title: title,
			}
			e.dataTransfer.setData(SONG_DRAG_DATA_TYPE, JSON.stringify(data))
		},
		[props.data.alias, props.data.packGuid, title]
	)

	const onDragEnd = useCallback(() => {
		setDragging(false)
	}, [])

	const children = useMemo(() => {
		return typeof props.children === 'function'
			? props.children(dragging)
			: props.children
	}, [props.children, dragging])

	return (
		<div
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			draggable={draggable}
			style={{
				opacity: dragging ? 0.5 : 1,
				...props.style,
			}}
		>
			<SongCardDragTemplate title={title} ref={img} />
			{children}
		</div>
	)
}
