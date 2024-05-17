'use client'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartMatch } from '../../../../routes/useSmartMatch'
import { Toolbar } from '../../Toolbar'
import GroupContainer from './components/GroupContainer'

interface AppContainerProps {
	children?: React.ReactNode
}

export default function Inner({ children }: AppContainerProps) {
	const { isOn } = useGroup()
	const expandable = useSmartMatch('group')
	const transparent = useSmartMatch('home')
	const hidden = useSmartMatch('playlistCards')

	const [isTop, setTop] = React.useState(true)

	const scrollLevel = 50
	useEffect(() => {
		const handleScroll = (event: any) => {
			const sy = window.scrollY
			if (sy > scrollLevel) {
				setTop(false)
			} else {
				setTop(true)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return hidden ? (
		children
	) : (
		<Box>
			{!isOn ? (
				<>
					<Toolbar transparent={transparent && isTop} />
					{children}
				</>
			) : (
				<>
					<GroupContainer expandable={expandable}>{children}</GroupContainer>
				</>
			)}
		</Box>
	)
}
