'use client'

import { Button } from '@/common/ui/Button'
import { Box } from '@mui/material'

export default function page() {
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
