'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box } from '@/common/ui'

export default SmartPage(page)
function page() {
	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			hola
		</Box>
	)
}
