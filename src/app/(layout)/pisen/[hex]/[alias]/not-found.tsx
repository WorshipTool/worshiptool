import { Box, Button, Typography } from '@/common/ui'
import MusicOff from '@mui/icons-material/MusicOff'
import { useTranslations } from 'next-intl'

export default function NotFound() {
	const t = useTranslations('errors')
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				padding: 8,
				textAlign: 'center',
			}}
		>
			<MusicOff sx={{ fontSize: '3.5rem', color: 'grey.400' }} />
			<Box>
				<Typography variant="h5" strong>
					{t('songNotFound')}
				</Typography>
				<Typography color="grey.700">
					{t('songNotFoundDescription')}
				</Typography>
			</Box>
			<Button to="home" variant="outlined">
				{t('goHome')}
			</Button>
		</Box>
	)
}
