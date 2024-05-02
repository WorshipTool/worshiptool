import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    ButtonGroup,
    Box,
    DialogContentText
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { searchGroupsEvent } from "../hooks/useToolsMenuItems";
import { useApi } from "../../../../../hooks/api/useApi";
import { useApiState } from "../../../../../tech/ApiState";
import { handleApiCall } from "../../../../../tech/handleApiCall";
import { on } from "events";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import { getGroupUrl, useSmartNavigate } from "../../../../../routes";
import { useNavigate } from "react-router-dom";
import { Group } from "../../../../../api/generated";

export default function SearchGroupDialog() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useState("");

    const { groupApi } = useApi();

    const { apiState, fetchApiState } = useApiState<Group[]>();

    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            setValue("");
        }
    }, [open]);

    useEffect(() => {
        const handler = () => {
            setOpen(true);
        };
        window.addEventListener(searchGroupsEvent.type, handler);
        return () => {
            window.removeEventListener(searchGroupsEvent.type, handler);
        };
    }, []);

    const onSearch = () => {
        fetchApiState(
            async () => {
                const result = await handleApiCall(
                    groupApi.groupControllerSearchGroups(value)
                );
                if (result.length === 0) {
                    throw new Error("Skupina nebyla nalezena");
                }
                return result;
            },
            (result) => {
                navigate(getGroupUrl(result[0].name));
                setOpen(false);
            }
        );
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Hledat skupinu</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Zadejte část kódu nebo názvu skupiny, kterou chcete otevřít.
                </DialogContentText>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>
                    <TextField
                        autoFocus
                        placeholder="Kód skupiny"
                        size="small"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        helperText={apiState.error?.message}
                        error={!!apiState.error?.message}
                        disabled={apiState.loading}
                    />
                    <LoadingButton
                        variant="contained"
                        onClick={onSearch}
                        startIcon={<Search />}
                        loading={apiState.loading}>
                        Hledat a otevřít
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
