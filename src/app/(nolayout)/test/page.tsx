'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Button } from '@/common/ui'

export default SmartPage(page)
function page() {
	return (
		<div>
			<Box display={'flex'}>
				<Button
					to="subdomain"
					toParams={{
						subdomain: 'ahoj',
					}}
				>
					Bez na poddomenu
				</Button>
			</Box>
		</div>
	)
}
