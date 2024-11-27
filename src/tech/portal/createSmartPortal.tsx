import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

type PortalItemProps = {
	children: ReactNode
	onMount: (unmount?: -1) => void
}
const PortalItem = (props: PortalItemProps) => {
	useEffect(() => {
		props.onMount()
		return () => props.onMount(-1)
	}, [])
	return props.children
}

export const getPortalUpdateEventName = (id: string) => {
	return `update-portal-children-${id}`
}

export const createSmartPortal = (
	children: ReactNode,
	containerId: string,
	key?: string
) => {
	const element = document.getElementById(containerId) as HTMLElement

	const onMount = () => {
		window.dispatchEvent(new Event(getPortalUpdateEventName(containerId)))
	}

	return element
		? createPortal(
				<PortalItem onMount={onMount}>{children}</PortalItem>,
				element,
				key
		  )
		: null
}
