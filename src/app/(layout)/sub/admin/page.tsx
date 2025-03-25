import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box } from '@/common/ui'

export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

function Page() {
	return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}></Box>
}
