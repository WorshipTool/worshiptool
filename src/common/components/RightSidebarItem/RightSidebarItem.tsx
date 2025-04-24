'use client'
import { RIGHT_SIDE_BAR_CLASSNAME } from '@/common/components/app/SmartPage/SmartPageInner'
import { createPortal } from 'react-dom'
import './styles.css'

type RightSidebarItemProps = {
	children?: React.ReactNode
}

export default function RightSidebarItem(props: RightSidebarItemProps) {
	return createPortal(
		<div className="right-side-bar-item">{props.children}</div>,
		document.querySelector(`.${RIGHT_SIDE_BAR_CLASSNAME}`) as Element
	)
}
