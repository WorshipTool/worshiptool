'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, useTheme } from '@mui/material'
import { useEffect } from 'react'
import useGroup from '../../hooks/group/useGroup'
import HomeDesktop from '../components/HomeDesktop'
import HomeMobile from '../components/HomeMobile'

export default SmartPage(Home, {
	transparentToolbar: true,
	hideTitle: true,
})

function Home() {
	const theme = useTheme()
	const { turnOff } = useGroup()

	useEffect(() => {
		turnOff()
	}, [])

	return (
		<>
			<Box
				flex={1}
				display={'flex'}
				sx={{
					[theme.breakpoints.down('sm')]: {
						display: 'none',
					},
				}}
			>
				<HomeDesktop />
			</Box>
			<Box
				flex={1}
				display={'none'}
				sx={{
					[theme.breakpoints.down('sm')]: {
						display: 'flex',
					},
				}}
			>
				<HomeMobile />
			</Box>
		</>
	)
}
