import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

type StandaloneCardProps = {
	title: string
	subtitle?: string
	children?: React.ReactNode
}

export function StandaloneCard(props: StandaloneCardProps) {
	return (
		<Box
			sx={{
				maxWidth: '500px',
			}}
		>
			<Box
				sx={{
					backgroundColor: 'white',
					borderRadius: 5,
					padding: 2,
					paddingX: 6,
					paddingBottom: 4,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',

					boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Typography size={'2.5rem'} strong={600}>
					{props.title}
				</Typography>
				<Typography align="center" size={'1.1rem'} color="grey.600">
					{props.subtitle}
				</Typography>
				{props.children}
			</Box>
		</Box>
	)
}
