import {
	CardActions,
	Card as CardContainer,
	CardContent,
	CardHeader,
	Divider,
} from '@mui/material'
import React from 'react'

type CardProps = {
	children?: React.ReactNode
	title?: string
	subtitle?: string
	icon?: React.ReactNode
	actions?: React.ReactNode
} & React.ComponentProps<typeof CardContainer>

export function Card(props: CardProps) {
	return (
		<CardContainer {...props}>
			{(props.title || props.subtitle) && (
				<CardHeader
					title={props.title}
					subheader={props.subtitle}
					avatar={props.icon}
				/>
			)}
			{props.children && (
				<CardContent
					sx={{
						marginTop: props.title || props.subtitle ? -2 : undefined,
					}}
				>
					{props.children}
				</CardContent>
			)}

			{props.actions && (
				<>
					<Divider />
					<CardActions>{props.actions}</CardActions>
				</>
			)}
		</CardContainer>
	)
}
