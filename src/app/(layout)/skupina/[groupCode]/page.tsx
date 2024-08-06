'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import GroupCustomLayout from './GroupCustomLayout'
import SelectionList from './components/SelectionList'

export default SmartPage(Page)
function Page() {
	return (
		<GroupCustomLayout>
			<SelectionList />
		</GroupCustomLayout>
	)
}
