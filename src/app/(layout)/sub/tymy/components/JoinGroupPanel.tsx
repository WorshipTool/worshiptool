'use client'
import JoinTeamPopup from '@/app/(layout)/sub/tymy/components/JoinTeamPopup'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { useState } from 'react'

export default function JoinGroupPanel() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Box
				sx={{
					bgcolor: 'grey.300',
					padding: 2,
					borderRadius: 2,
					boxShadow: '0px 1px 4px rgba(0,0,0,0.3)',
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'center'}
					alignItems={'center'}
					gap={2}
				>
					<Typography size={'1.2rem'}>
						Připoj se k existujímu týmu pomocí kódu
					</Typography>
					<Button
						color="primarygradient"
						onClick={() => {
							setOpen(true)
						}}
					>
						Připojit se
					</Button>
				</Box>
			</Box>

			<JoinTeamPopup open={open} onClose={() => setOpen(false)} />
		</>
	)
}
