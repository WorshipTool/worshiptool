'use client'
import { POPUP_DIV_CONTAINER_ID } from '@/common/components/Popup/PopupProvider'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type PopupProps = {
	children?: React.ReactNode
}
export default function PopupContainer({ children }: PopupProps) {
	const ref = useRef<HTMLDivElement | null>(null)

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${POPUP_DIV_CONTAINER_ID}`)
		setMounted(true)
		return () => setMounted(false)
	}, [])

	return ref.current && mounted ? createPortal(children, ref.current) : null
}
