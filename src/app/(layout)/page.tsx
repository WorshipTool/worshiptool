'use client'

import ParseAdminOption from '@/app/(layout)/vytvorit/components/ParseAdminOption'
import HomeDesktop from '@/app/components/HomeDesktop'
import useBottomPanel from '@/app/providers/BottomPanelProvider'
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
	const p = useBottomPanel()

	useEffect(() => {
		turnOff()
		p.setHeight(70) //TODO: this is because of admin options... do it better
	}, [])

	return (
		<>
			<HomeDesktop />

			<ParseAdminOption />
		</>
	)
}
