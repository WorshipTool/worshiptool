'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Typography } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { useEffect } from 'react'

const INTERVAL = 5000
export default SmartPage(SubdomainPage)
function SubdomainPage() {
	const a = useSmartParams('subdomain')

	const navigate = useSmartNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate('home', { hledat: undefined })
		}, INTERVAL)
		return () => clearTimeout(timer)
	}, [])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				gap: 2,
			}}
		>
			<Typography uppercase variant="h3" strong>
				{a.subdomain + '?'}
			</Typography>
			<Typography>Na této subdoméně jsme nic nenašli.</Typography>
			<Typography italic>
				Za chvíli budete přesměrováni na domovskou stránku...
			</Typography>
		</Box>
	)
}
