import { Box, Clickable, Typography } from '@/common/ui'
import { ColorType } from '@/common/ui/ui.types'
import React from 'react'

type Props = {
	onClick?: () => void

	children?: React.ReactNode
	color?: ColorType
}

export default function AdminPageCard({
	color = 'primary.main',
	...props
}: Props) {
	return (
		<Clickable onClick={props.onClick}>
			<Box
				sx={{
					bgcolor: color,
					borderRadius: 3,
					padding: 2,
					aspectRatio: 2 / 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',

					// border: '2px solid',
					// borderColor: 'primary.light',

					color: 'white',
				}}
			>
				<Typography strong>{props.children}</Typography>
			</Box>
		</Clickable>
	)
}
