import React, { useRef, useState } from "react";
import { NewSongDataDTO, NewSongDataResult } from "../api/dtos/dtosNewSongData";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import { SourceTypes } from "../interfaces/song/source";
import useAuth from "../hooks/auth/useAuth";
import { CreatorDTOTypeEnum, NewSongDataProcessResult } from "../api/generated";
import { useApiState } from "../tech/ApiState";
import { handleApiCall } from "../tech/handleApiCall";
import { CreatorType } from "../interfaces/song/creator";
import { useApi } from "../hooks/api/useApi";

interface AddCreatorProps {
    open: boolean;
    handleClose: () => void;
    afterUpload?: (r: NewSongDataProcessResult) => void;
    songGuid?: string;
}

export default function AddCreator({
    open,
    handleClose,
    afterUpload,
    songGuid
}: AddCreatorProps) {
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
                        creators: [
                            {
                                type: CreatorType.Author,
                                name: value
                            }
                        ]
                    })
                );
            },
            (d) => {
                setErrorMessage("");
                onClose();
                if (afterUpload) afterUpload(d);
            }
        );

        const dto: Partial<NewSongDataDTO> = {
            songGuid,
            creators: [
                {
                    type: CreatorType.Author,
                    name: value
                }
            ]
        };
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Přidej autora</DialogTitle>
            <DialogContent>
                <DialogContentText>Znáš autora této písně?</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="source"
                    label="Jméno autora"
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
