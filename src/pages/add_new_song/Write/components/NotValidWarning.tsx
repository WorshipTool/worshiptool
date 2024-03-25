import { ListItemText } from "@mui/material";
import React from "react";

export default function NotValidWarning() {
    return (
        <ListItemText
            primary={"Neplatný obsah"}
            secondary={"Obsah musí být delší a mít alespoň dva řádky"}
        />
    );
}
