import { Box, styled } from '@mui/material'
import React from 'react'

type PanelProps = {
	children: React.ReactNode
} & React.ComponentProps<typeof Box>

const Container = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[200],
	padding: theme.spacing(2),
	borderRight: `1px inset ${theme.palette.grey[400]}`,
	borderBottom: `1px inset ${theme.palette.grey[400]}`,
}))

export default function Panel(props: PanelProps) {
	return <Container {...props}>{props.children}</Container>
}
