'use client'
import {
	ADMIN_OPTIONS_PROVIDER_ID,
	ADMIN_OPTIONS_PROVIDER_NOTIFY_ID,
	CLOSE_ADMIN_OPTIONS_EVENT_NAME,
} from '@/common/components/admin/AdminOptions'
import MenuItem from '@/common/components/Menu/MenuItem'
import { createSmartPortal } from '@/tech/portal/createSmartPortal'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'

type AdminOptionProps = {
	notify?: boolean
	onlyNotification?: boolean
	label?: string
	title?: string
	subtitle?: string
	icon?: ReactElement
	onClick?: (e: React.MouseEvent<HTMLElement>) => any
	stayOpenedOnClick?: boolean

	disabled?: boolean
	loading?: boolean

    order?: number
}

export default function AdminOption({
    order = 0,
    ...props
}: AdminOptionProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	const providerId = useMemo(
		() =>
			props.notify
				? ADMIN_OPTIONS_PROVIDER_NOTIFY_ID
				: ADMIN_OPTIONS_PROVIDER_ID,
		[props.notify]
	)

	useEffect(() => {
		ref.current = document.querySelector(`#${providerId}`)
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [providerId])

	const onClick = (e: React.MouseEvent<HTMLElement>) => {
		props.onClick?.(e)

		if (!props.onlyNotification && !props.stayOpenedOnClick)
			window.dispatchEvent(new CustomEvent(CLOSE_ADMIN_OPTIONS_EVENT_NAME))
	}

	const menuItem = useMemo(() => {
		return (
			<MenuItem
				title={props.label || props.title || ''}
				subtitle={
					props.subtitle || (props.onlyNotification ? 'Jen upozornění' : '')
				}
				icon={props.icon}
				onClick={onClick}
				disabled={props.disabled || props.loading}
			/>
		)
	}, [props, onClick])

	return ref.current && mounted ? createSmartPortal(menuItem, providerId) : null
}
