import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import SongSelect from "../../../../components/songLists/SongSelect/SongSelect";
import useGroupSelection from "../../../../hooks/group/useGroupSelection";
import { SongVariantDto } from "../../../../api/dtos";

interface RemoveFromSelectionProps {
    onChange?: () => void;
}

export default function RemoveFromSelection({
    onChange: onChangeCallback
}: RemoveFromSelectionProps) {
    const selection = useGroupSelection();
    const [selectedVariant, setSelectedVariant] =
        React.useState<SongVariantDto | null>(null);
    const onChange = (v: SongVariantDto | null) => {
        setSelectedVariant(v);
    };

    const onAddClick = async () => {
        if (selectedVariant === null) return;

        await selection.removeVariant(selectedVariant.alias);
        onChangeCallback?.();

        // window.location.reload();
    };
    const filter = (v: SongVariantDto) => {
        return !!selection.items.find((s) => s.variant.guid === v.guid);
    };
    return (
        <Box>
            <Typography>Vyber píseň k odebrani</Typography>
            <SongSelect onChange={onChange} filter={filter} />
            <Button variant="contained" color="primary" onClick={onAddClick}>
                Odebrat z výběru
            </Button>
        </Box>
    );
}
