'use client'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import useAuth from '@/hooks/auth/useAuth'
import React from 'react'

type OnlyAdminProps = {
	children?: React.ReactNode
}

export default function OnlyAdmin(props: OnlyAdminProps) {
	const { isAdmin } = useAuth()
	return (
		<>
			{isAdmin() ? (
				<Tooltip title="Toto vidí pouze admin">
					<div
						style={{
							border: '1px dotted black',
							borderStyle: 'dashed',
							borderRadius: '5px',
							padding: '4px',
						}}
					>
						{props.children}
					</div>
				</Tooltip>
			) : null}
		</>
	)
}
