import { Tooltip as Tltp, TooltipProps } from '@mui/material'
import React, { ReactElement } from 'react'

type CustomTooltipProps = {
	children?: ReactElement
	label?: string
	title?: string
} & Omit<TooltipProps, 'title'>

const MyComponent = React.forwardRef(function Component(innerProps: any, ref) {
	return (
		<div {...innerProps} ref={ref as any}>
			{innerProps.children}
		</div>
	)
})

export default function Tooltip(props: CustomTooltipProps) {
	return (
		<Tltp {...props} title={props.title || props.label}>
			<MyComponent>{props.children}</MyComponent>
		</Tltp>
	)
}
