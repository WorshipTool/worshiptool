import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { cloneElement } from 'react'

type AboutInfoCardProps = {
	title: string
	text?: string
	icon?: React.ReactElement
}
export default function AboutInfoCard(props: AboutInfoCardProps) {
	return (
		<Box
			sx={{
				bgcolor: 'grey.200',
				padding: 2,
				borderRadius: 2,
				// width: '10rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: 'grey.800',
				fontSize: '2rem',
			}}
		>
			{props.icon && (
				<>
					{cloneElement(props.icon, { sx: { fontSize: 'inherit' } })}
					<Gap />
				</>
			)}
			<Typography color={'black'} strong>
				{props.title}
			</Typography>
			<Typography color="grey.700" align="center">
				{props.text}
			</Typography>
		</Box>
	)
}
