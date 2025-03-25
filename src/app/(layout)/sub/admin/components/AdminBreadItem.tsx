'use client'
import { ADMIN_BREADCRUMBS_PROVIDER_ID } from '@/app/(layout)/sub/admin/components/AdminBreadcrumbs'
import { Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { RoutesKeys, SmartAllParams } from '@/routes'
import { createSmartPortal } from '@/tech/portal/createSmartPortal'
import { useEffect, useMemo, useRef, useState } from 'react'
type Item<T extends RoutesKeys = RoutesKeys> = {
	label: string
	to: T
	toParams: SmartAllParams<T>
	base?: boolean
}
export default function AdminBreadItem<T extends RoutesKeys>(props: Item<T>) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	const providerId = ADMIN_BREADCRUMBS_PROVIDER_ID

	useEffect(() => {
		ref.current = document.querySelector(`#${providerId}`)
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [providerId])

	const menuItem = useMemo(() => {
		return (
			<>
				{!props.base && (
					<Typography
						key={props.label + 'a'}
						small
						color="grey.500"
						sx={{
							userSelect: 'none',
						}}
					>
						{'<'}
					</Typography>
				)}
				<Link to={props.to} params={props.toParams}>
					<Typography
						key={props.label}
						small
						color={'grey.500'}
						sx={{
							'&:hover': {
								color: 'grey.800',
							},
							transition: 'color 0.2s',
						}}
					>
						{props.label}
					</Typography>
				</Link>
			</>
		)
	}, [props])

	return ref.current && mounted ? createSmartPortal(menuItem, providerId) : null
}
