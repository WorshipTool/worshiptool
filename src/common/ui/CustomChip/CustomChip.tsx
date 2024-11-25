import { Box, Typography, useTheme } from '@mui/material'
import React, { ReactElement } from 'react'

type ChipProps = {
	icon?: ReactElement
	label?: string
	color?: string
	borderColor?: string
	children?: React.ReactNode
}

export function CustomChip({
	icon,
	label,
	color,
	borderColor,
	children,
}: ChipProps) {
	const theme = useTheme()
	color = color || theme.palette.primary.main
	borderColor = borderColor || color

	return (
		<Box
			color={color}
			sx={{
				border: '1px solid',
				paddingX: '0.5rem',
				borderRadius: '0.5rem',
				borderColor: borderColor,
			}}
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
			gap={0.5}
			marginLeft={-0.5}
			fontSize={'1rems'}
		>
			{/* Create icon and Set fontSize to inherit */}
			{icon && React.cloneElement(icon, { fontSize: 'inherit' })}

			{/* Create label */}

			<Typography variant="subtitle2">{label}</Typography>

			{/* Create children */}
			{children}
		</Box>
	)
}
