'use client'
import { Box, Button, Typography } from '@/common/ui'
import { useTranslations } from 'next-intl'

export default function AllListPanel() {
	const tHome = useTranslations('home')
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
			flexWrap={'wrap'}
			sx={{
				bgcolor: 'background.paper',
				borderRadius: 3,
				boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
				overflow: 'hidden',
			}}
		>
			<Button
				variant="text"
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					paddingY: 1.25,
				}}
				color="black"
				to="songsList"
				// color="primarygradient"
			>
				<Typography small color="grey.500">
					{tHome('allList.browse')}
				</Typography>
				{tHome('allList.title')}
			</Button>
		</Box>
	)
}
