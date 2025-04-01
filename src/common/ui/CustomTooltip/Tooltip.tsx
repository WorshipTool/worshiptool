import { Box } from '@/common/ui/Box'
import { Tooltip as Tltp, TooltipProps } from '@mui/material'
import React, { ReactElement } from 'react'

type CustomTooltipProps = {
	children?: ReactElement
	label?: string
	title?: string
	disabled?: boolean
	component?: React.ElementType
} & Omit<TooltipProps, 'title'>

const MyComponent = React.forwardRef(function Component(
	innerProps: {
		children: ReactElement
		component?: CustomTooltipProps['component']
	},
	ref
) {
	return (
		<Box {...innerProps} ref={ref as any} component={innerProps.component}>
			{innerProps.children}
		</Box>
	)
})

export function Tooltip({ component = 'span', ...props }: CustomTooltipProps) {
	const title = props.title || props.label

	return props.disabled || !title || title.length === 0 ? (
		<>{props.children}</>
	) : (
		<Tltp {...props} title={title}>
			<MyComponent component={component}>{props.children}</MyComponent>
		</Tltp>
	)
}
