import { Box, IconButton as IconBtn, SxProps } from '@mui/material'
import React, { ComponentProps, useMemo } from 'react'
import { RoutesKeys } from '../../../routes'
import { Clickable } from '../Clickable'
import Tooltip from '../CustomTooltip/Tooltip'
import { CommonLinkProps, Link } from '../Link/Link'
import { ColorType, isColorOfThemeType } from '../ui.types'

type IconButtonProps<T extends RoutesKeys> = {
	children: React.ReactNode
	onClick?: React.MouseEventHandler<HTMLDivElement>
	color?: ColorType
	size?: 'small' | 'medium' | 'large'

	alt?: string

	tooltip?: string
	tooltipPlacement?: ComponentProps<typeof Tooltip>['placement']
	to?: CommonLinkProps<T>['to']
	toParams?: CommonLinkProps<T>['params']
	target?: React.HTMLAttributeAnchorTarget

	sx?: SxProps<{}>
	disabled?: boolean
}

const ButtonComponent = ({ color, ...props }: IconButtonProps<RoutesKeys>) => {
	props.alt = props.alt || props.tooltip
	return (
		<Box
			sx={{
				...props.sx,
				color: color
					? isColorOfThemeType(color)
						? undefined
						: color
					: (props.sx as any)?.color,
			}}
		>
			<IconBtn
				color={
					color ? (isColorOfThemeType(color) ? color : 'inherit') : undefined
				}
				onClick={(e: any) => props.onClick?.(e)}
				disabled={props.disabled}
				aria-label={props.alt}
				size={props.size}
			>
				{props.children}
			</IconBtn>
		</Box>
	)
}

const LinkComponent = <T extends RoutesKeys>(props: IconButtonProps<T>) => {
	const typedParams: CommonLinkProps<T>['params'] = useMemo(
		() => props.toParams as CommonLinkProps<T>['params'],
		[props.toParams]
	)
	return props.to ? (
		<Link
			to={props.to}
			params={typedParams}
			sx={props.sx}
			target={props.target}
		>
			<ButtonComponent {...props} />
		</Link>
	) : (
		<ButtonComponent {...props} />
	)
}

const ClickableComponent = <T extends RoutesKeys>({
	...props
}: IconButtonProps<T>) => {
	return (
		<Clickable>
			{props.tooltip ? (
				<Tooltip title={props.tooltip} placement={props.tooltipPlacement}>
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
