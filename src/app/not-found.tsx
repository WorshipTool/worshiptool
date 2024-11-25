import { Box, Button, Typography } from '@/common/ui'
import { Home } from '@mui/icons-material'
import { Gap } from '../common/ui/Gap'

export default function ErrorPage() {
	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			<Box
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'end'}
				alignItems={'center'}
			>
				<Typography variant="h2" strong={900}>
					Oops...
				</Typography>
				<Gap value={2} />
				<Typography variant="h6">
					Něco se nepovedlo. Stránka nebyla nalezena.
				</Typography>
				<Gap value={2} />
				<Button
					variant="contained"
					color="primary"
					to="home"
					size="medium"
					endIcon={<Home />}
				>
					Jít domů
				</Button>
			</Box>
		</Box>
	)
}
