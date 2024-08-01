import { LoadingButton } from '@mui/lab'
import { Box, SxProps } from '@mui/material'
import { ComponentProps, useMemo } from 'react'
import { RoutesKeys } from '../../../routes'
import Tooltip from '../CustomTooltip/Tooltip'
import { CustomLink } from '../Link'
import { CommonLinkProps } from '../Link/CustomLink'
import { ColorType, isColorOfThemeType } from '../ui.types'

type ButtonProps<T extends RoutesKeys> = {
	children?: string
	variant?: 'contained' | 'outlined' | 'text'
	color?: ColorType
	size?: 'small' | 'medium' | 'large'
	onClick?: () => void
	tooltip?: string
	tooltipPlacement?: ComponentProps<typeof Tooltip>['placement']
	to?: CommonLinkProps<T>['to']
	toParams?: CommonLinkProps<T>['params']
	sx?: SxProps<{}>
	alt?: string

	startIcon?: React.ReactNode
	endIcon?: React.ReactNode

	loading?: boolean
	loadingPosition?: ComponentProps<typeof LoadingButton>['loadingPosition']
	disabled?: boolean
	type?: ComponentProps<typeof LoadingButton>['type']
}

export const Button = <T extends RoutesKeys>({
	children = '',
	variant = 'contained',
	color = 'primary',
	size = 'medium',
	onClick,

	...props
}: ButtonProps<T>) => {
	const disabled = useMemo(
		() => props.loading || props.disabled,
		[props.loading, props.disabled]
	)

	props.alt = props.alt || props.tooltip

	const ButtonComponent = () => (
		<Box
			sx={{
				...props.sx,
				color: isColorOfThemeType(color) ? undefined : color,
			}}
		>
			<LoadingButton
				loading={props.loading}
				disabled={disabled}
				variant={variant}
				color={isColorOfThemeType(color) ? color : 'inherit'}
				size={size}
				onClick={onClick}
				startIcon={props.startIcon}
				endIcon={props.endIcon}
				aria-label={props.alt}
				type={props.type}
				sx={{
					width: '100%',
					height: '100%',
				}}
			>
				{children}
			</LoadingButton>
		</Box>
	)

	const typedParams: CommonLinkProps<T>['params'] =
		props.toParams as CommonLinkProps<T>['params']

	const LinkComponent = () =>
		props.to && !disabled ? (
			<CustomLink
				to={props.to}
				params={typedParams}
				sx={{
					display: 'flex',
					...props.sx,
				}}
			>
				<ButtonComponent />
			</CustomLink>
		) : (
			<ButtonComponent />
		)

	return props.tooltip && !disabled ? (
		<Tooltip title={props.tooltip} placement={props.tooltipPlacement}>
			<LinkComponent />
		</Tooltip>
	) : (
		<LinkComponent />
	)
}
