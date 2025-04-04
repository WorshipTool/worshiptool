import Grid from '@mui/material/Grid'
import { GridDirection } from '@mui/material/Grid/Grid'
import { SxProps } from '@mui/system'
import { ReactNode } from 'react'

interface ContainerGridProps {
	children: ReactNode
	direction?: GridDirection
	sx?: SxProps
}

const gutter = 10
const columnWidth = 100
const count = 12

const maxWidth = columnWidth * count + gutter * (count - 1) // in px: 12 * 100 + 11 * 10 = 1320
export const containerMaxWidth = maxWidth // in px

export default function ContainerGrid({
	children,
	direction,
	sx,
}: ContainerGridProps) {
	return (
		<Grid container maxWidth={maxWidth} direction={direction} sx={sx}>
			{children}
		</Grid>
	)
}
