import { Box } from '@mui/material'
import React from 'react'

type ServerComponentProps = {
	children: React.ReactNode
}

export function ServerComponent(props: ServerComponentProps) {
	return <Box>{props.children}</Box>
}
