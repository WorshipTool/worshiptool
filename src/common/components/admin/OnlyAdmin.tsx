'use client'
import { Tooltip } from '@/common/ui/CustomTooltip/Tooltip'
import { IconButton } from '@/common/ui/IconButton'
import useAuth from '@/hooks/auth/useAuth'
import { AdminPanelSettings } from '@mui/icons-material'
import React, { useState } from 'react'

type OnlyAdminProps = {
	children?: React.ReactNode
	notCollapse?: boolean
	hideEnvelope?: boolean
}

export default function OnlyAdmin(props: OnlyAdminProps) {
	const { isAdmin } = useAuth()

	const [collapsed, setCollapsed] = useState<boolean>(
		!Boolean(props.notCollapse)
	)
	return props.hideEnvelope ? (
		props.children
	) : (
		<>
			{isAdmin() ? (
				<Tooltip
					title={
						collapsed
							? 'Klikni pro zobrazení obsahu pro admina'
							: 'Toto vidí pouze admin'
					}
				>
					<div
						style={{
							borderWidth: '1px',
							borderStyle: 'dashed',
							borderRadius: '5px',
							padding: collapsed ? 0 : '4px',
							borderColor: collapsed ? 'grey' : 'black',
							display: 'flex',
							alignItems: 'center',
						}}
						onClick={() => setCollapsed(false)}
					>
						{collapsed ? (
							<IconButton
								size="small"
								// onClick={() => setCollapsed(false)}

								color="black"
							>
								<AdminPanelSettings />
							</IconButton>
						) : (
							props.children
						)}
					</div>
				</Tooltip>
			) : null}
		</>
	)
}
