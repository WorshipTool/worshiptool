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
import { SourceTypes } from "../../interfaces/song/source";
import useAuth from "../../hooks/auth/useAuth";
import { NewSongDataProcessResult } from "../../api/generated";
import { useApiState } from "../../tech/ApiState";
import { handleApiCall } from "../../tech/handleApiCall";
import { useApi } from "../../hooks/api/useApi";

interface AddSourceProps {
    open: boolean;
    handleClose: () => void;
    afterUpload?: (r: NewSongDataProcessResult) => void;
    songGuid?: string;
}

export default function AddSource({
    open,
    handleClose,
    afterUpload,
    songGuid
}: AddSourceProps) {
    const inputRef = useRef();

    const { songAddingApi } = useApi();
    const { fetchApiState, apiState } = useApiState<NewSongDataProcessResult>();

    const [errorMessage, setErrorMessage] = useState("");

    const onClose = () => {
        setErrorMessage("");
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
                        source: {
                            type: SourceTypes.Url,
                            value
                        }
                    })
                );
            },
            (d) => {
                setErrorMessage("");
                onClose();
                if (afterUpload) afterUpload(d);
            }
        );
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Přidej zdroj</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Našel jsi na internetu nějakou píseň? Hoď nám sem odkaz ať
                    jí můžeme přidat do databáze.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="source"
                    label="Url zdroje"
                    helperText={
                        apiState.error && "Něco se pokazilo při nahrávání."
                    }
                    type="email"
                    fullWidth
                    variant="standard"
                    inputRef={inputRef}
                    error={errorMessage != ""}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Zrušit</Button>
                <Button onClick={upload}>Přidat</Button>
            </DialogActions>
        </Dialog>
    );
}
