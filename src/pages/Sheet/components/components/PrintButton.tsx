import { Print } from "@mui/icons-material";
import { Button, IconButton, useTheme } from "@mui/material";
import React from "react";

interface PrintButtonProps {}

export default function PrintButton(props: PrintButtonProps) {
    const onPrintClick = () => {
        window.print();
    };
    const theme = useTheme();
    return (
        <div>
            <Button
                endIcon={<Print />}
                variant="outlined"
                color="primary"
                onClick={onPrintClick}
                sx={{
                    [theme.breakpoints.down("md")]: {
                        display: "none"
                    }
                }}>
                Tisknout
            </Button>
            <IconButton
                onClick={onPrintClick}
                sx={{
                    [theme.breakpoints.up("md")]: {
                        display: "none"
                    }
                }}>
                <Print />
            </IconButton>
        </div>
    );
}
