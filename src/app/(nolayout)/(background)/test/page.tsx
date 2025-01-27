'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import FlagProtected from '@/common/providers/FeatureFlags/FlagProtected'
import { Box } from '@/common/ui'

export default SmartPage(page)
function page() {
	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			hola
			<FlagProtected flag={'Flag1'}>
				<Box>Alohaa jeaah</Box>
			</FlagProtected>
		</Box>
	)
}
