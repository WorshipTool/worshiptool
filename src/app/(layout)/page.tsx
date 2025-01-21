'use client'

import HomeDesktop from '@/app/components/HomeDesktop'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useEffect } from 'react'
import useGroup from '../../hooks/group/useGroup'

export default SmartPage(Home, {
	hideTitle: true,
	transparentToolbar: null,
	hideFooter: null,
})

function Home() {
	const { turnOff } = useGroup()

	useEffect(() => {
		turnOff()
	}, [])

	return (
		<>
			<HomeDesktop />
		</>
	)
}
