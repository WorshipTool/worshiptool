import { Box } from '@mui/material'
import React from 'react'

type TeamEditablePanelProps = {
	children?: (inEditMode: boolean) => React.ReactNode
}

export default function TeamEditablePanel(props: TeamEditablePanelProps) {
	const [inEditMode, setInEditMode] = React.useState(false)
	return <Box>{props.children?.(inEditMode)}</Box>
}
