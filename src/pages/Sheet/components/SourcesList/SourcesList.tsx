import React from "react";
import { SongVariantDto } from "../../../../api/dtos";
import SourceListItem from "./SourceListItem";
import { Box } from "@mui/material";

export type SongPageProps = {
    variant: SongVariantDto;
};
export function SourcesList({ variant }: SongPageProps) {
    return (
        <Box display={"flex"} flexWrap={"wrap"} gap={1}>
            {variant.sources?.map((source, index) => (
                <SourceListItem source={source} />
            ))}
        </Box>
    );
}
