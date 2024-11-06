import { Box } from '@/common/ui'
import { Typography } from '@/common/ui/Typography'
import React, { cloneElement } from 'react'

type AboutToolCardProps = {
	title: string
	text?: string
	icon?: React.ReactElement
	button?: React.ReactElement
}

export default function AboutToolCard(props: AboutToolCardProps) {
	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			alignItems={'center'}
			fontSize={'3rem'}
			color={'primary.main'}
			flex={1}
			minWidth={200}
		>
			{props.icon && (
				<Box
					sx={{
						width: 100,
						height: 100,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						// bgcolor: 'grey.100',
					}}
				>
					{cloneElement(props.icon, {
						sx: { fontSize: 'inherit' },
					})}
				</Box>
			)}

			<Typography align="center" variant="h4" strong color="black">
				{props.title}
			</Typography>

			<Typography align="center" variant="h5" color="grey.600">
				{props.text}
			</Typography>

			<Box flex={1} />
			<Box>{props.button}</Box>
		</Box>
	)
}
