'use client'

import React, { useMemo } from 'react'
import { PermissionDataType } from '../../../hooks/permissions/permission.types'
import { usePermissions } from '../../../hooks/permissions/usePermissions'
import { SkeletonLoader } from '../SkeletonLoader'

export type WithPermissionOnlyProps = {
	permissions: PermissionDataType[] | PermissionDataType
	children?: React.ReactNode
}

export default function WithPermissionOnly(props: WithPermissionOnlyProps) {
	const a = usePermissions()
	const containsAll = useMemo(() => {
		return Array.isArray(props.permissions)
			? props.permissions.every((p) => a.includesPermission(p.type, p.payload))
			: a.includesPermission(props.permissions.type, props.permissions.payload)
	}, [a.permissions])
	return (
		<SkeletonLoader
			data={[a.state]}
			render={() => <>{containsAll && props.children}</>}
			renderLoading={() => <></>}
		/>
	)
}
