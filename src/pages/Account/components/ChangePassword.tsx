import { Box, Typography } from "@mui/material";
import React from "react";
import { useWindowTitle } from "../../../hooks/useWindowTitle";
import Card from "../../../common/ui/Card/Card";

export default function ChangePassword() {
    useWindowTitle("Změna hesla");
    return (
        <Card>
            <Typography variant="caption">
                Informace uživatele zatím nelze změnit.
            </Typography>
            <Typography variant="caption">
                Na této funkcionalitě se zatím stále pracuje...
            </Typography>
        </Card>
    );
}
