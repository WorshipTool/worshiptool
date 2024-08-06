'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import GroupCustomLayout from './GroupCustomLayout'
import SelectionList from './components/SelectionList'

export default SmartPage(Page, {
	transparentToolbar: true,
	whiteToolbarVersion: true,
	hideMiddleNavigation: true,
	hideFooter: true,
	hideTitle: true,
})
function Page() {
	return (
		<GroupCustomLayout>
			<SelectionList />
		</GroupCustomLayout>
	)
}
