'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useTheme } from '@mui/material'
import { useEffect } from 'react'
import useGroup from '../../hooks/group/useGroup'
import HomeDesktop from '../components/HomeDesktop'

export default SmartPage(Home, {
	hideTitle: true,
	transparentToolbar: null,
	hideFooter: null,
})

function Home() {
	const theme = useTheme()
	const { turnOff } = useGroup()

	useEffect(() => {
		turnOff()
	}, [])

	return <HomeDesktop />
}
