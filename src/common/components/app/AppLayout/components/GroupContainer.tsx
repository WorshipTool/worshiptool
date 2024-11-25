'use client'
import { Box } from '@/common/ui'
import React from 'react'
import OnScrollComponent from '../../../../providers/OnScrollComponent/OnScrollComponent'
import { SideToolbar } from '../../../Toolbar'
import GroupToolbarDesktop from '../../../Toolbar/GroupToolbar/GroupToolbarDesktop'
import GroupToolbarMobile from '../../../Toolbar/GroupToolbar/GroupToolbarMobile'

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
						{/* <GroupToolbar expanded={expandable && top} header={header} /> */}
						<Box
							display={{
								xs: 'none',
								sm: 'block',
							}}
						>
							<GroupToolbarDesktop expanded={expandable && top} />

							<SideToolbar>
								<>{children}</>
							</SideToolbar>
						</Box>
						<Box
							display={{
								xs: 'block',
								sm: 'none',
							}}
						>
							<GroupToolbarMobile expanded={expandable && top} />
							{children}
						</Box>
					</Box>
				)
			}}
		/>
	)
}
