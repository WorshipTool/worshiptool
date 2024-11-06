'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Button, Typography } from '@/common/ui'
import { useLiveMessage } from '@/hooks/sockets/useLiveMessage'
import { useState } from 'react'

export default SmartPage(page)
function page() {
	const [number, setNumber] = useState(0)
	const [channel, setChannel] = useState(0)

	const { send } = useLiveMessage('all' + channel, {
		number: (data: number) => {
			setNumber(data)
		},
	})

	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			<Box display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>
				<Button
					onClick={() => {
						const n = Math.round(Math.random() * 1000)
						setNumber(n)
						send('number', n)
					}}
				>
					Posli cislo
				</Button>
				<Typography>{number}</Typography>
			</Box>
			<Button
				onClick={() => {
					setChannel((channel + 1) % 3)
				}}
			>
				Prepnout kanal {channel}
			</Button>
		</Box>
	)
}
