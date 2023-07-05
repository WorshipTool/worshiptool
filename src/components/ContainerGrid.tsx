import { Grid, GridDirection } from '@mui/material'
import React, { ReactNode } from 'react'

interface ContainerGridProps{
    children: ReactNode
    direction?: GridDirection;
}

export default function ContainerGrid({children, direction}:ContainerGridProps) {
    const gutter = 10;
    const columnWidth = 100;
    const count = 12;

    const maxWidth = columnWidth * count + gutter * (count-1);
  return (
    <Grid container maxWidth={maxWidth} direction={direction}>
        {children}
    </Grid>
  )
}
