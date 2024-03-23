import React from "react";
import { Masonry } from "@mui/lab";
import { useTheme } from "@mui/material";
import SearchItem from "./components/SearchItem";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { SongVariantDto } from "../../../api/dtos";

interface SongListCardsProps {
    variants: SongVariantDto[];
    onClick?: (variant: SongVariantDto) => void;
    columns?: number;
    itemBorder?: boolean;
}

export default function SongListCards({
    variants,
    onClick,
    columns,
    itemBorder
}: SongListCardsProps) {
    const theme = useTheme();
    const spacing = 1;
    return variants.length === 0 ? (
        <></>
    ) : (
        <Masonry
            columns={columns || { xs: 1, md: 2, lg: 4 }}
            sx={{
                marginLeft: -(spacing / 2),
                width: `calc(100% + ${theme.spacing(spacing)})`
            }}
            spacing={spacing}>
            {variants.map((v) => {
                return (
                    <SearchItem
                        variant={v}
                        key={v.guid}
                        onClick={onClick}
                        border={itemBorder}></SearchItem>
                );
            })}
        </Masonry>
    );
}
