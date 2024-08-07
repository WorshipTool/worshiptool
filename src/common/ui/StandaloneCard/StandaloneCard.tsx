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
				backgroundColor: 'white',
				borderRadius: 2,
				padding: 2,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography variant="h3" strong={600}>
				{props.title}
			</Typography>
			<Typography align="center" size={'1.2rem'} color="grey.700">
				{props.subtitle}
			</Typography>
			{props.children}
		</Box>
	)
}
