import React, { useMemo } from "react";
import { Masonry } from "@mui/lab";
import { useTheme } from "@mui/material";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { SongVariantDto } from "../../../api/dtos";
import SongCard from "../../SongCard/SongCard";
import { ResponsiveStyleValue } from "@mui/system";

type CommmonProps = {
    data: SongVariantDto[];
};

type ListProps = CommmonProps & {
    variant: "list";
};

type MasonryGridProps = CommmonProps & {
    variant?: "masonrygrid";
    columns?: ResponsiveStyleValue<string | number>;
};

type RowProps = CommmonProps & {
    variant: "row";
    columns?: ResponsiveStyleValue<string | number>;
};

type SongListCardsProps = ListProps | MasonryGridProps | RowProps;

export default function SongListCards(props: SongListCardsProps) {
    const theme = useTheme();
    const spacing = 1;

    let columns: ResponsiveStyleValue<string | number> = useMemo(() => {
        switch (props.variant) {
            case "list":
                return 1;
                break;
            case undefined:
            case "masonrygrid":
            case "row":
                return {
                    xs: 1,
                    md: 2,
                    lg: 4
                };
        }
    }, [props]);

    return props.data.length === 0 ? (
        <></>
    ) : (
        <Masonry
            columns={columns}
            sx={{
                marginLeft: -(spacing / 2),
                width: `calc(100% + ${theme.spacing(spacing)})`
            }}
            spacing={spacing}>
            {props.data.map((v) => {
                return (
                    <SongCard
                        data={v}
                        key={v.guid}
                        publicityMode="privateandloader"
                        flexibleHeght={props.variant !== "row"}
                    />
                );
            })}
        </Masonry>
    );
}
