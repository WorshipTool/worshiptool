import { Box, Typography } from "@mui/material";
import React from "react";
import { useWindowTitle } from "../../../hooks/useWindowTitle";

export default function ChangePassword() {
    useWindowTitle("Změna hesla");
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="caption">
                Informace uživatele zatím nelze změnit.
            </Typography>
            <Typography variant="caption">
                Na této funkcionalitě se zatím stále pracuje...
            </Typography>
        </Box>
    );
}
