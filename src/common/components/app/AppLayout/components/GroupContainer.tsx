'use client'
import { Box } from '@mui/material'
import React from 'react'
import OnScrollComponent from '../../../../providers/OnScrollComponent/OnScrollComponent'
import { SideToolbar } from '../../../Toolbar'
import GroupToolbar from '../../../Toolbar/GroupToolbar/GroupToolbar'

interface GroupContainerProps {
	children?: React.ReactNode
	expandable?: boolean
	header?: React.ReactNode
}

export default function GroupContainer({
	children,
	expandable,
	header,
}: GroupContainerProps) {
	return (
		<OnScrollComponent
			component={(top) => {
				return (
					<Box position={'relative'} left={0} right={0}>
						<GroupToolbar expanded={expandable && top} header={header} />
						<SideToolbar>
							<>{children}</>
						</SideToolbar>
					</Box>
				)
			}}
		/>
	)
}
