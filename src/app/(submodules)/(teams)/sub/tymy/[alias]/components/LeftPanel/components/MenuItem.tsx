'use client'
import { theme } from '@/common/constants/theme'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Link } from '@/common/ui/Link/Link'
import { Typography } from '@/common/ui/Typography'
import { RoutesKeys, SmartAllParams } from '@/routes'
import { useSmartMatch } from '@/routes/useSmartMatch'
import { Box, alpha } from '@mui/material'
import { ReactNode, useCallback } from 'react'

type MenuItemProps<T extends RoutesKeys> = {
	title: string
	icon: React.ReactNode
	to: T
	toParams: SmartAllParams<T>
	disabled?: boolean
	hidden?: boolean

	collapsed?: boolean
}

export default function MenuItem<T extends RoutesKeys>(
	props: MenuItemProps<T>
) {
	const enabled = useSmartMatch(props.to)

	const Envelope = useCallback(
		function A({ children }: { children: ReactNode }) {
			return props.to && !props.disabled ? (
				<Tooltip
					label={props.title}
					// disabled={!props.collapsed}
					placement="right"
				>
					<Link to={props.to} params={props.toParams}>
						{children}
					</Link>
				</Tooltip>
			) : (
				<>{children}</>
			)
		},
		[props.to, props.disabled]
	)

	return props.hidden ? null : (
		<Envelope>
			<Box
				display={'flex'}
				flexDirection={'row'}
				alignItems={'center'}
				sx={{
					padding: 1,
					paddingX: props.collapsed ? 1.3 : 3,
					opacity: props.disabled ? 0.5 : 1,
					bgcolor: alpha(theme.palette.primary.main, enabled ? 0.1 : 0),
					borderRadius: 3,
					transition: 'all 0.1s ease',
					[':hover']: !props.disabled
						? {
								bgcolor: alpha(theme.palette.primary.main, 0.1),
						  }
						: {},
					[':active']: !props.disabled
						? {
								bgcolor: alpha(theme.palette.primary.main, 0.2),
						  }
						: {},
					userSelect: 'none',
					minWidth: props.collapsed ? 0 : 150,
				}}
				color={'grey.800'}
				gap={2}
			>
				<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
					{props.icon}
				</Box>

				{
					<Typography strong={enabled} noWrap>
						{props.title}
					</Typography>
				}
			</Box>
		</Envelope>
	)
}
