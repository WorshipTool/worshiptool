'use client'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { Clickable } from '@/common/ui/Clickable'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Typography } from '@/common/ui/Typography'
import { Box, CircularProgress, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useMemo } from 'react'

type TeamQuickActionButtonProps = {
	label: string
	tooltip: string
	icon: React.ReactNode

	onClick?: () => void
	disabled?: boolean
	loading?: boolean

	color?: 'primary' | 'secondary' | 'white'
}

export default function TeamQuickActionButton({
	onClick,
	disabled,
	loading,
	color = 'primary',
	...props
}: TeamQuickActionButtonProps) {
	const theme = useTheme()
	const dis = useMemo(() => disabled || loading, [disabled, loading])
	return (
		<Tooltip label={props.tooltip} disabled={dis}>
			<Clickable onClick={onClick} disabled={dis}>
				<TeamCard
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: 130,
						height: '5.5rem',

						transition: 'all 0.3s',

						...(disabled
							? {
									background: grey[300],
									color: 'grey.400',
							  }
							: color === 'primary'
							? {
									background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
									color: 'white',
							  }
							: color === 'secondary'
							? {
									background: theme.palette.secondary.main,
									color: 'black',
							  }
							: {
									background: 'white',
									color: 'black',
							  }),
					}}
				>
					<Box flex={1} paddingRight={'1rem'}>
						<Typography
							variant="h6"
							strong
							// strong={500}
							sx={{ userSelect: 'none' }}
							// lineHeight={'inherit'}
						>
							{props.label}
						</Typography>
					</Box>
					<Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
						{disabled ? (
							<CircularProgress size={'2rem'} color="inherit" />
						) : (
							props.icon
						)}
					</Box>
				</TeamCard>
			</Clickable>
		</Tooltip>
	)
}
