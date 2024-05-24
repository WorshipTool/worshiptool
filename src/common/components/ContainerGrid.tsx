import { Grid, GridDirection, SxProps } from "@mui/material";
import React, { ReactNode } from "react";

interface ContainerGridProps {
    children: ReactNode;
    direction?: GridDirection;
    sx?: SxProps;
}

export default function ContainerGrid({
    children,
    direction,
    sx
}: ContainerGridProps) {
    const gutter = 10;
    const columnWidth = 100;
    const count = 12;

    const maxWidth = columnWidth * count + gutter * (count - 1);
    return (
        <Grid container maxWidth={maxWidth} direction={direction} sx={sx}>
            {children}
        </Grid>
    );
}
