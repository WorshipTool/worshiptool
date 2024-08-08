import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
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
			height={'13rem'}
		>
			{props.icon && (
				<>
					{cloneElement(props.icon, {
						sx: { fontSize: 'inherit' },
					})}
				</>
			)}

			<Typography align="center" size={'1.4rem'} strong color="black">
				{props.title}
			</Typography>

			<Typography align="center" color="grey.700">
				{props.text}
			</Typography>

			<Box flex={1} />
			<Box>{props.button}</Box>
		</Box>
	)
}
