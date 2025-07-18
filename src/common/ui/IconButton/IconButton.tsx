import { Box } from '@/common/ui/Box'
import { getColorHex } from '@/tech/theme/theme.tech'
import { IconButton as IconBtn, SxProps, darken, useTheme } from '@mui/material'
import React, { ComponentProps, useMemo } from 'react'
import { RoutesKeys } from '../../../routes'
import { Clickable } from '../Clickable'
import { Tooltip } from '../CustomTooltip/Tooltip'
import { CommonLinkProps, Link } from '../Link/Link'
import { ColorType } from '../ui.types'

type IconButtonProps<T extends RoutesKeys> = {
	children: React.ReactNode
	onClick?: React.MouseEventHandler<HTMLDivElement>
	color?: ColorType
	size?: 'small' | 'medium' | 'large'

	variant?: 'contained' | 'outlined' | 'text'

	alt?: string

	tooltip?: string
	tooltipPlacement?: ComponentProps<typeof Tooltip>['placement']
	to?: CommonLinkProps<T>['to']
	toParams?: CommonLinkProps<T>['params']
	target?: React.HTMLAttributeAnchorTarget

	sx?: SxProps<{}>
	disabled?: boolean

	squared?: boolean

	// aliases
	small?: boolean
}

const ButtonComponent = ({
	color: _color,
	variant = 'text',
	...props
}: IconButtonProps<RoutesKeys>) => {
	props.alt = props.alt || props.tooltip
	props.size = props.small ? 'small' : props.size

	const theme = useTheme()

	// get color in hex
	const color = _color ? getColorHex(_color) : undefined

	return (
		<Box
			sx={{
				...props.sx,
				color: color || (props.sx as any)?.color,
			}}
		>
			<IconBtn
				color={color ? 'inherit' : undefined}
				onClick={(e: any) => props.onClick?.(e)}
				disabled={props.disabled}
				aria-label={props.alt}
				size={props.size}
				sx={{
					...(variant === 'text'
						? {}
						: variant === 'outlined'
						? {
								outline: '1px solid',
								outlineColor: color,
						  }
						: variant === 'contained'
						? {
								boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
								bgcolor: color,

								'&:hover': {
									bgcolor: color ? darken(color, 0.2) : undefined,
									boxShadow: '0 3px 6px 0 rgba(0,0,0,0.2)',
								},

								color: color ? theme.palette.getContrastText(color) : undefined,
						  }
						: {}),

					...(props.squared
						? {
								borderRadius: 1,
								// Apply square ripple effect
								'& .MuiTouchRipple-root .MuiTouchRipple-child': {
									borderRadius: 1,
								},
						  }
						: {}),
					transition: 'all 0.3s',
				}}
			>
				{props.children}
			</IconBtn>
		</Box>
	)
}

const LinkComponent = <T extends RoutesKeys>(props: IconButtonProps<T>) => {
	const button = useMemo(() => {
		return <ButtonComponent {...props} />
	}, [props])

	return props.to ? (
		<Link
			key={props.to + JSON.stringify(props.toParams)}
			to={props.to}
			params={props.toParams as CommonLinkProps<T>['params']}
			target={props.target}
		>
			{button}
		</Link>
	) : (
		button
	)
}

const ClickableComponent = <T extends RoutesKeys>({
	...props
}: IconButtonProps<T>) => {
	return (
		<Clickable>
			{props.tooltip ? (
				<Tooltip
					title={props.tooltip}
					placement={props.tooltipPlacement}
					disabled={props.disabled}
				>
					<LinkComponent {...props} />
				</Tooltip>
			) : (
				<LinkComponent {...props} />
			)}
		</Clickable>
	)
}

export const IconButton = <T extends RoutesKeys>({
	...props
}: IconButtonProps<T>) => {
	return <ClickableComponent {...props} />
}
