'use client'

import MiddleNavigationPanel from '@/common/components/Toolbar/components/MiddleNavigationPanel/MiddleNavigationPanel'
import { Box, styled, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import LeftWebTitle from './components/LeftWebTItle'
import RightAccountPanel from './components/RightAccountPanel/RightAccountPanel'

const TopBar = styled(Box)(() => ({
	right: 0,
	left: 0,
	top: 0,
	height: 56,
	minHeight: 50,
	alignItems: 'center',
	display: 'flex',
	displayPrint: 'none',
	zIndex: 10,
	pointerEvents: 'none',
}))

interface ToolbarProps {
	transparent?: boolean
	white?: boolean
}
export function Toolbar({ transparent, white }: ToolbarProps) {
	const theme = useTheme()

	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	return (
		<>
			<TopBar displayPrint={'none'} position={'sticky'} zIndex={0}></TopBar>
			<TopBar displayPrint={'none'} position={'fixed'}>
				<motion.div
					style={{
						background: `linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
					}}
					initial={{ opacity: transparent ? 0 : 1 }}
					animate={{ opacity: transparent ? 0 : 1 }}
					transition={{ duration: 0.3 }}
				/>

				<Box
					zIndex={0}
					flexDirection={'row'}
					justifyContent={'space-between'}
					alignItems={'center'}
					display={'flex'}
					flex={1}
					height={'100%'}
					color={transparent ? 'black' : 'white'}
				>
					<LeftWebTitle transparent={transparent} />
					<MiddleNavigationPanel />

					<Box
						sx={{
							opacity: init ? 1 : 0,
							transition: 'opacity 0.3s',
						}}
					>
						<RightAccountPanel transparent={transparent && !white} />
					</Box>
				</Box>
			</TopBar>
		</>
	)
}
