'use client'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { ArrowBack } from '@mui/icons-material'
import { useSmartNavigate } from '@/routes/useSmartNavigate'

interface GoBackButtonProps {
	hex: string
	alias: string
}

export default function GoBackButton({ hex, alias }: GoBackButtonProps) {
	const navigate = useSmartNavigate()

	const goBack = () => {
		navigate('variant', { hex, alias })
	}

	return (
		<Box sx={{ padding: 2 }}>
			<Button
				startIcon={<ArrowBack />}
				onClick={goBack}
				sx={{
					bgcolor: 'rgba(0,0,0,0.5)',
					color: 'white',
					'&:hover': {
						bgcolor: 'rgba(0,0,0,0.7)',
					},
				}}
			>
				Zpět na píseň
			</Button>
		</Box>
	)
}