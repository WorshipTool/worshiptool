import { Box, CircularProgress, Typography } from '@/common/ui'
import { Paper } from '@/common/ui/mui'
import React from 'react'
import { Gap } from '../../../../common/ui/Gap'
import { Link } from '../../../../common/ui/Link/Link'
import { RoutesKeys } from '../../../../routes'

interface AddMenuItemProps {
	title?: string
	to: RoutesKeys
	icon?: React.ReactNode
	iconSize?: number
	disabled?: boolean
	subtitle?: React.ReactNode
	loading?: boolean
}

export default function AddMenuItem(props: AddMenuItemProps) {
	const size = 200
	return (
		<Link to={props.to} params={{}} disabled={props.disabled}>
			<Paper
				sx={{
					width: size,
					height: size,
					'&:hover': props.disabled
						? {}
						: {
								backgroundColor: 'rgba(255,255,255,0.4)',
								transform: 'scale(1.02)',
						  },
					transition: 'all 0.2s ease-in-out',
					opacity: props.disabled ? 0.5 : 1,
				}}
			>
				<Box
					sx={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Box
						sx={{
							fontSize: props.iconSize || 60,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							height: 60,
						}}
					>
						{props.icon}
						{props.loading && !props.disabled && (
							<CircularProgress
								size={85}
								thickness={2}
								sx={{
									position: 'absolute',
								}}
							/>
						)}
					</Box>

					<Gap value={1} />
					<Typography
						variant="h6"
						sx={{
							textAlign: 'center',
							userSelect: 'none',
						}}
					>
						{props.title}
					</Typography>
					<Typography
						sx={{
							textAlign: 'center',
							userSelect: 'none',
							paddingX: 3,
							lineHeight: 1.2,
						}}
						color={'grey'}
					>
						{props.subtitle}
					</Typography>
				</Box>
			</Paper>

			{props.loading && props.disabled && (
				<Box
					sx={{
						position: 'absolute',
						transform: 'translate(0%, -100%)',
						width: size,
						height: size,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<CircularProgress color="inherit" size={40} />
				</Box>
			)}
		</Link>
	)
}
