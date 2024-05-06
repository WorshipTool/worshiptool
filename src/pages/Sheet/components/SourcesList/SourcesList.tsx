import React from "react";
import { SongVariantDto } from "../../../../api/dtos";
import SourceListItem from "./SourceListItem";
import { Box, Typography } from "@mui/material";
import Gap from "../../../../common/ui/Gap/Gap";

export type SongPageProps = {
    variant: SongVariantDto;
};
export function SourcesList({ variant }: SongPageProps) {
    return (
        <Box>
            <Typography variant="subtitle2">Zdroje:</Typography>
            <Gap value={0.25} />
            <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                {variant.sources?.map((source, index) => (
                    <SourceListItem source={source} />
                ))}
            </Box>
        </Box>
    );
}
