'use client'

import LeftWebTitle from '@/common/components/Toolbar/components/LeftWebTItle'
import MiddleNavigationPanel from '@/common/components/Toolbar/components/MiddleNavigationPanel/MiddleNavigationPanel'
import NavigationMobilePanel from '@/common/components/Toolbar/components/MiddleNavigationPanel/NavigationMobilePanel'
import RightAccountPanel from '@/common/components/Toolbar/components/RightAccountPanel/RightAccountPanel'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box, useTheme } from '@/common/ui'
import { styled, useMediaQuery } from '@mui/system'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const TopBar = styled(Box)(({ theme }) => ({
	right: 0,
	left: 0,
	top: 0,
	height: 56,
	display: 'flex',
	flexDirection: 'column',
	displayPrint: 'none',
	zIndex: 10,
	pointerEvents: 'none',
	transition: 'all 0.3s ease',
}))

interface ToolbarProps {
	// transparent?: boolean
	// white?: boolean
}
export function Toolbar({}: ToolbarProps) {
	const theme = useTheme()

	const { transparent, whiteVersion, hidden } = useToolbar()

	const white = useMemo(() => {
		return whiteVersion || !transparent
	}, [whiteVersion, transparent])

	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	const navigationInMiddle = useMediaQuery(theme.breakpoints.up('md'))

	return (
		<>
			<TopBar
				displayPrint={'none'}
				position={'sticky'}
				zIndex={0}
				sx={{
					transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
				}}
			></TopBar>
			<TopBar
				displayPrint={'none'}
				position={'fixed'}
				sx={{
					transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
				}}
			>
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
					color={!white ? 'black' : 'white'}
				>
					<LeftWebTitle />
					{navigationInMiddle && <MiddleNavigationPanel />}

					<Box
						sx={{
							opacity: init ? 1 : 0,
							transition: 'opacity 0.3s',
							display: 'flex',
							flexDirection: 'row',
							paddingRight: 2,
						}}
					>
						<RightAccountPanel />
						{!navigationInMiddle && <MiddleNavigationPanel />}
					</Box>
				</Box>
			</TopBar>
			<NavigationMobilePanel />
		</>
	)
}
