import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'

export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

function Page() {
	return <>ahoj in admin page global</>
}
