'use client'
import {
	LinkBlockerCondition,
	useOutsideBlocker,
} from '@/common/ui/Link/useOutsideBlocker'
import { ReactNode, useEffect } from 'react'

// Return true if the link should be blocked

type Props = {
	children?: ReactNode
	condition: LinkBlockerCondition
	popupTitle: string
	popupMessage: string
	disabled?: boolean
}

export default function OutsideLinkBlocker(props: Props) {
	const { addCondition, removeCondition } = useOutsideBlocker()

	useEffect(() => {
		if (props.disabled) return

		addCondition(props.condition, {
			title: props.popupTitle,
			message: props.popupMessage,
		})
		return () => {
			removeCondition(props.condition)
		}
	}, [props.condition, props.popupMessage, props.popupTitle, props.disabled])

	return props.children
}
