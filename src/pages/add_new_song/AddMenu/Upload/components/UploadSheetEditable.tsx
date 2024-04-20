import { Sheet } from "@pepavlin/sheet-api";
import React, { useMemo, useState } from "react";
import DefaultStyle from "../../../../../components/SheetDisplay/styles/DefaultStyle";
import {
    Box,
    Button,
    InputBase,
    Paper,
    Switch,
    Typography,
    styled
} from "@mui/material";

interface UploadSheetEditableProps {
    title: string;
    data: string;
    originalFile: File;
    onDelete?: () => void;
    onChange?: (title: string, data: string) => void;
}

const StyledInput = styled(InputBase)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100]
}));

export default function UploadSheetEditable(props: UploadSheetEditableProps) {
    const [editable, setEditable] = React.useState(false);

    const [title, setTitle] = React.useState(props.title);
    const [sheetData, setSheetData] = React.useState(props.data);

    const sheet = useMemo(() => {
        props.onChange?.(title, sheetData);
        return new Sheet(sheetData);
    }, [sheetData, title]);

    return (
        <Paper
            sx={{
                padding: 2,
                marginBottom: 2
            }}>
            <Box sx={{}}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                    <Button
                        color="error"
                        onClick={() => {
                            props.onDelete?.();
                        }}
                        size="small">
                        Zahodit
                    </Button>
                    <Typography variant="subtitle2" fontWeight={200}>
                        Nalezeno v <strong>{props.originalFile.name}</strong>
                    </Typography>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            setEditable(!editable);
                            if (editable) {
                            }
                        }}>
                        {editable ? "Uložit" : "Upravit"}
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: editable ? "none" : "block",
                    padding: 2,
                    paddingRight: 5
                }}>
                <DefaultStyle sheet={sheet} title={title}></DefaultStyle>
            </Box>

            <Box
                sx={{
                    display: editable ? "flex" : "none",
                    padding: 2,
                    flexDirection: "column",
                    gap: 2
                }}>
                <StyledInput
                    placeholder="Název písně"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <StyledInput
                    placeholder="Obsah písně"
                    value={sheetData}
                    multiline
                    onChange={(e) => {
                        setSheetData(e.target.value);
                    }}
                />
            </Box>
        </Paper>
    );
}
