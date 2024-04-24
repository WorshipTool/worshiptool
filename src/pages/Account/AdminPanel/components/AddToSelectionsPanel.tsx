import { Card, Typography } from "@mui/material";
import React from "react";
import Gap from "../../../../components/Gap";
import useGroup from "../../../../hooks/group/useGroup";
import AddToSelection from "./AddToSelection";
import RemoveFromSelection from "./RemoveFromSelection";

export default function AddToSelectionsPanel() {
    const { isOn } = useGroup();
    return (
        <Card>
            {isOn ? (
                <>
                    <Gap />
                    <Typography variant="h6">
                        Spravovat playlist skupiny
                    </Typography>
                    <AddToSelection />
                    <RemoveFromSelection />
                </>
            ) : (
                <>
                    <Typography>Skupina není aktivní</Typography>
                </>
            )}
        </Card>
    );
}
