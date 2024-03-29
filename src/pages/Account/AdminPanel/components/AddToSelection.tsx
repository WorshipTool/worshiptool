import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import SongSelect from "../../../../components/songLists/SongSelect/SongSelect";
import { useNavigate } from "react-router-dom";
import useGroup from "../../../../hooks/group/useGroup";
import useGroupSelection from "../../../../hooks/group/useGroupSelection";
import { SongVariantDto } from "../../../../api/dtos";

interface AddToSelectionProps {
    onChange?: () => void;
}

export default function AddToSelection({
    onChange: onChangeCallback
}: AddToSelectionProps) {
    const selection = useGroupSelection();
    const { url } = useGroup();
    const [selectedVariant, setSelectedVariant] =
        React.useState<SongVariantDto | null>(null);
    const onChange = (v: SongVariantDto | null) => {
        setSelectedVariant(v);
    };

    const navigate = useNavigate();

    const onAddClick = async () => {
        if (selectedVariant === null) return;

        await selection.addVariant(selectedVariant.guid);
        onChangeCallback?.();

        // window.location.reload();
    };
    const filter = (v: SongVariantDto) => {
        return !selection.items.find((s) => s.variant.guid === v.guid);
    };
    return (
        <Box>
            <Typography>Vyber píseň k přídání</Typography>
            <SongSelect onChange={onChange} filter={filter} />
            <Button variant="contained" color="primary" onClick={onAddClick}>
                Přidat do výběru
            </Button>
        </Box>
    );
}
