'use client'
import { Box, useTheme } from '@mui/material'
import { useEffect } from 'react'
import useAuth from '../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../routes/useSmartNavigate'
import BasicInfo from './components/BasicInfo'
import TabsPanel from './components/TabsPanel'

export default function Account() {
	const { isLoggedIn } = useAuth()

	const navigate = useSmartNavigate()

	useEffect(() => {
		if (!isLoggedIn()) {
			navigate('login', {
				previousPage: 'account',
				message: 'Pro zobrazeni účtu se musíte přihlásit.',
			})
		}
	}, [isLoggedIn()])

	const theme = useTheme()

	return (
		<>
			<Box
				sx={{
					[theme.breakpoints.down('md')]: {
						display: 'none',
					},
					padding: 8,
				}}
			>
				<TabsPanel />
			</Box>

			<Box
				sx={{
					[theme.breakpoints.up('md')]: {
						display: 'none',
					},
				}}
			>
				<BasicInfo />
			</Box>
		</>
	)
}
