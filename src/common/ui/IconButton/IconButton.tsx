import { Box, IconButton as IconBtn, SxProps } from '@mui/material'
import React, { ComponentProps, useMemo } from 'react'
import { RoutesKeys } from '../../../routes'
import { Clickable } from '../Clickable'
import Tooltip from '../CustomTooltip/Tooltip'
import { CommonLinkProps, Link } from '../Link/CustomLink'
import { ColorType, isColorOfThemeType } from '../ui.types'

type IconButtonProps<T extends RoutesKeys> = {
	children: React.ReactNode
	onClick?: React.MouseEventHandler<HTMLDivElement>
	color?: ColorType

	tooltip?: string
	tooltipPlacement?: ComponentProps<typeof Tooltip>['placement']
	to?: CommonLinkProps<T>['to']
	toParams?: CommonLinkProps<T>['params']

	sx?: SxProps<{}>
	disabled?: boolean
}

const ButtonComponent = ({
	color = 'primary',
	...props
}: IconButtonProps<RoutesKeys>) => {
	return (
		<Box
			sx={{
				...props.sx,
				color: isColorOfThemeType(color) ? undefined : color,
			}}
		>
			<IconBtn
				color={isColorOfThemeType(color) ? color : 'inherit'}
				onClick={(e: any) => props.onClick?.(e)}
				disabled={props.disabled}
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
		<Link to={props.to} params={typedParams} sx={props.sx}>
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
