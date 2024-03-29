import React, { useRef, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import useAuth from "../hooks/auth/useAuth";
import { NewSongDataProcessResult } from "../api/generated";
import { useApiState } from "../tech/ApiState";
import { handleApiCall } from "../tech/handleApiCall";
import { useApi } from "../hooks/api/useApi";

interface AddTagProps {
    open: boolean;
    handleClose: () => void;
    afterUpload?: (r: NewSongDataProcessResult) => void;
    songGuid?: string;
}

export default function AddTag({
    open,
    handleClose,
    afterUpload,
    songGuid
}: AddTagProps) {
    const inputRef = useRef();
    const { songAddingApi } = useApi();
    const { fetchApiState, apiState } = useApiState<NewSongDataProcessResult>();

    const onClose = () => {
        //@ts-ignore
        inputRef.current.value = "";
        handleClose();
    };

    const upload = () => {
        //@ts-ignore
        const value = inputRef.current.value;

        fetchApiState(
            async () => {
                return handleApiCall(
                    songAddingApi.songAddingControllerCreate({
                        songGuid,
                        tags: [value]
                    })
                );
            },
            (d) => {
                onClose();
                if (afterUpload) afterUpload(d);
            }
        );
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Přidej tag</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Máš nápad na tag, který se hodí k písni?
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="source"
                    label="Jméno tagu"
                    helperText={
                        apiState.error && "Něco se pokazilo při nahrávání."
                    }
                    type="email"
                    fullWidth
                    variant="standard"
                    inputRef={inputRef}
                    error={apiState.error?.message != ""}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Zrušit</Button>
                <Button onClick={upload}>Přidat</Button>
            </DialogActions>
        </Dialog>
    );
}
