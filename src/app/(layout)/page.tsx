'use client'

import HomeDesktop from '@/app/components/HomeDesktop'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'

export default SmartPage(Home, {
	hideTitle: true,
	transparentToolbar: null,
	hideFooter: null,
})

function Home() {
	return (
		<>
			<HomeDesktop />
		</>
	)
}
