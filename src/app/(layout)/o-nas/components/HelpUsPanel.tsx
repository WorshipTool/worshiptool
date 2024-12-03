'use client'
import { Box, Button, Typography } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'

export default function HelpUsPanel() {
	const navigate = useSmartNavigate()

	const onJoinClick = () => {
		navigate('contact', {
			wantToJoin: true,
		})
	}
	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			gap={2}
			flexWrap={'wrap'}
			flex={1}
		>
			<Box display={'flex'} flexDirection={'column'}>
				<Typography variant="h2" noWrap>
					Chcete nám pomoct?
				</Typography>
				<Typography variant="h4" color="grey.600">
					Chtěli byste se k projektu jakýmkoliv způsobem připojit?
				</Typography>
			</Box>
			<Box display={'flex'}>
				<Button color={'primarygradient'} onClick={onJoinClick}>
					Chci se připojit
				</Button>
			</Box>
		</Box>
	)
}
