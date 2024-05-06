import React, { useRef, useState } from "react";
import useYoutube from "../../hooks/useYoutube";
import {
    NewSongDataDTO,
    NewSongDataResult
} from "../../api/dtos/dtosNewSongData";
import { MediaTypes } from "../../interfaces/song/media";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";
import { useApiState } from "../../tech/ApiState";
import { NewSongDataProcessResult } from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { useApi } from "../../hooks/api/useApi";

interface AddVideoProps {
    open: boolean;
    handleClose: () => void;
    afterUpload?: (r: NewSongDataProcessResult) => void;
    songGuid?: string;
}

export default function AddVideo({
    open,
    handleClose,
    afterUpload,
    songGuid
}: AddVideoProps) {
    const inputRef = useRef();

    const { getId } = useYoutube();
    const { songAddingApi } = useApi();
    const { fetchApiState } = useApiState<NewSongDataProcessResult>();

    const [errorMessage, setErrorMessage] = useState("");

    const onClose = () => {
        setErrorMessage("");
        //@ts-ignore
        inputRef.current.value = "";
        handleClose();
    };

    const upload = () => {
        //@ts-ignore
        const url = inputRef.current.value;
        const id = getId(url);
        if (id == null) {
            setErrorMessage("Neplatný formát URL");
            return;
        }

        fetchApiState(
            async () => {
                return handleApiCall(
                    songAddingApi.songAddingControllerCreate({
                        songGuid,
                        media: [
                            {
                                type: MediaTypes.Youtube,
                                url: url
                            }
                        ]
                    })
                ).catch((e) => {
                    setErrorMessage("Něco se pokazilo při nahrávání.");
                    throw e;
                });
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
            <DialogTitle>Přidej video</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Našel jsi na Youtube video k této písni? Přidej ho. Jiné
                    zdroje zatím nejsou podporovány.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Url videa"
                    helperText={errorMessage}
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
