import MenuItem, { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import useSmartPortalMenu from '@/common/components/SmartPortalMenuItem/SmartPortalMenuProvider'
import { createSmartPortal } from '@/tech/portal/createSmartPortal'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = MenuItemObjectType

export default function SmartPortalMenuItem(props: Props) {
	const { containerId } = useSmartPortalMenu()
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${containerId}`)
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [containerId])

	const menuItem = useMemo(() => {
		return <MenuItem {...props} />
	}, [props])

	return ref.current && mounted
		? createSmartPortal(menuItem, containerId)
		: null
}
