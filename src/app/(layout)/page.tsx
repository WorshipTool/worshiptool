'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect } from 'react'
import useGroup from '../../hooks/group/useGroup'
import HomeDesktop from '../components/HomeDesktop'
import HomeMobile from '../components/HomeMobile'

export default SmartPage(Home, {
	hideTitle: true,
	transparentToolbar: null,
})

function Home() {
	const theme = useTheme()
	const { turnOff } = useGroup()

	useEffect(() => {
		turnOff()
	}, [])

	const Desktop = useMediaQuery(theme.breakpoints.up('sm'))

	return <>{Desktop ? <HomeDesktop /> : <HomeMobile />}</>
}
