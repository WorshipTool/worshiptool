import { Box } from '@/common/ui'
import React from 'react'

type ServerComponentProps = {
	children: React.ReactNode
}

export function ServerComponent(props: ServerComponentProps) {
	return <Box>{props.children}</Box>
}
