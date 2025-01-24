'use client'

import { Box, Button, Typography } from '@/common/ui'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
		//TODO: send report to admin
	}, [error])

	return (
		<Box
			sx={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
			}}
		>
			<Typography align="center" variant="h3">
				Někde nastala chyba!
			</Typography>
			<Button onClick={reset}>Zkusit znovu</Button>
		</Box>
	)
}
