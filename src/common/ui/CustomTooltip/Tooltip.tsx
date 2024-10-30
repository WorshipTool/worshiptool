import { Tooltip as Tltp, TooltipProps } from '@mui/material'
import React, { ReactElement } from 'react'

type CustomTooltipProps = {
	children?: ReactElement
	label?: string
	title?: string
	disabled?: boolean
} & Omit<TooltipProps, 'title'>

const MyComponent = React.forwardRef(function Component(innerProps: any, ref) {
	return (
		<div {...innerProps} ref={ref as any}>
			{innerProps.children}
		</div>
	)
})

export default function Tooltip(props: CustomTooltipProps) {
	const title = props.title || props.label

	return props.disabled || !title || title.length === 0 ? (
		<>{props.children}</>
	) : (
		<Tltp {...props} title={title}>
			<MyComponent>{props.children}</MyComponent>
		</Tltp>
	)
}
