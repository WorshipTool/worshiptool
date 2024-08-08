import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

export default function JoinGroupPanel() {
	return (
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
				<Button color="primarygradient">Připojit se</Button>
			</Box>
		</Box>
	)
}
