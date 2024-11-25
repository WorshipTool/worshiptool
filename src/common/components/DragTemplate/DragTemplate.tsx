import { DRAG_TEMPLATE_CONTAINER_ID } from '@/common/components/DragTemplate/DragTemplateContainer'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type DragTemplateProps = {
	children: React.ReactNode
}

export default function DragTemplate(props: DragTemplateProps) {
	const ref = useRef<HTMLDivElement | null>(null)

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${DRAG_TEMPLATE_CONTAINER_ID}`)
		setMounted(true)
		return () => setMounted(false)
	}, [])

	return ref.current && mounted
		? createPortal(props.children, ref.current)
		: null
}
