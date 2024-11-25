'use client'
import { RIGHT_SIDE_BAR_CLASSNAME } from '@/common/components/app/SmartPage/SmartPageInner'
import { Toolbar } from '@/common/components/Toolbar'
import { Box } from '@/common/ui'
import React from 'react'
import { useSmartMatch } from '../../../../routes/useSmartMatch'
import Footer from '../../Footer/Footer'
import './applayout.styles.css'

interface AppContainerProps {
	children?: React.ReactNode
}

export default function Inner({ children }: AppContainerProps) {
	const hidden = useSmartMatch('playlistCards')

	return hidden ? (
		children
	) : (
		<Box display={'flex'} flexDirection={'column'} minHeight={'100vh'}>
			<Toolbar />
			<Box className={'app-body-container'}>
				{children}
				<Box className={RIGHT_SIDE_BAR_CLASSNAME}></Box>
			</Box>

			<Box flex={1} />
			<Footer />
		</Box>
	)
}
