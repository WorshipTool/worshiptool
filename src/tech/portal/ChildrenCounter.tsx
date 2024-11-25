import { getPortalUpdateEventName } from '@/tech/portal/createSmartPortal'
import { ReactElement, useCallback, useEffect } from 'react'

type ChildrenCounterProps = {
	children: ReactElement
	onCountChange: (count: number) => void
}

export default function ChildrenCounter(props: ChildrenCounterProps) {
	// Get child id if it exists
	const childId = props.children.props.id

	const recalculateCount = useCallback((id: string): number => {
		return document.querySelectorAll(`#${id} > *`).length
	}, [])

	useEffect(() => {
		if (!childId) return

		const handler = () => {
			props.onCountChange(recalculateCount(childId))
		}

		window.addEventListener(getPortalUpdateEventName(childId), handler)

		return () => {
			window.removeEventListener(getPortalUpdateEventName(childId), handler)
		}
	}, [childId, recalculateCount])

	return props.children
}
