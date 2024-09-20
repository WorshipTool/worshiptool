import { Box } from '@mui/material'
import { LayoutProps } from '../../../../common/types'
import { Gap } from '../../../../common/ui/Gap'
import { Typography } from '../../../../common/ui/Typography'
import { generateSmartMetadata } from '../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'usersSongs',
	async () => {
		return {
			title: 'Moje písně',
		}
	}
)

export default function layout(props: LayoutProps) {
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'center'}
			sx={{
				width: '100%',
			}}
		>
			<Box
				sx={{
					marginTop: 5,
					marginBottom: 5,
					flex: 1,
					padding: 2,
				}}
				maxWidth={800}
			>
				<Typography variant="h5" strong={600}>
					Moje písně:
				</Typography>
				<Gap value={2} />
				{props.children}
			</Box>
		</Box>
	)
}
