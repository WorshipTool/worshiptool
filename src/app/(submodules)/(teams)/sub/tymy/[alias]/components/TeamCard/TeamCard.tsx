import { Typography } from '@/common/ui/Typography'
import { Box, SxProps } from '@mui/material'
import React from 'react'

type TeamCardProps = {
	title?: string
	children?: React.ReactNode
	sx?: SxProps
}

export default function TeamCard(props: TeamCardProps) {
	return (
		<Box
			sx={{
				padding: 3,
				borderRadius: 3,
				bgcolor: 'grey.100',
				// boxShadow: 1,
				...props.sx,
			}}
		>
			{props.title && (
				<Typography variant="h6" strong>
					{props.title}
				</Typography>
			)}
			{props.children}
		</Box>
	)
}
