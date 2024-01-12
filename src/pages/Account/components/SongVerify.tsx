import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React, { useState } from 'react'
import useSong from '../../../hooks/song/useSong'
import { getUrl_DELETEVARIANT, getUrl_VERIFYVARIANT } from '../../../api/urls';
import useAuth from '../../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { SongsApi } from '../../../api/generated';
import { handleApiCall } from '../../../tech/handleApiCall';

export interface SongVerifyProps{
    guid: string,
    afterClick: ()=>void
}

export default function SongVerify({guid, afterClick}:SongVerifyProps) {
    const {getName, loading, song} = useSong(guid);

    // const {post} = useFetch();

    const navigate = useNavigate();

    const {isAdmin, apiConfiguration} = useAuth();
    const songsApi = new SongsApi(apiConfiguration);

    
    const [popupOpen, setPopupOpen] = useState(false);

    const closePopup = () => {
        setPopupOpen(false);
    }

    const show = () => {
        navigate("/song/"+guid);
        afterClick();
    }

    const verify = () => {
        if(!song)return;
        handleApiCall(songsApi.songsControllerVerify(song.variants[0].guid))
        .then((r)=>{
            afterClick();
        })
        .catch((e)=>{
            console.log(e);
        })
    }
    const openDeletePopup = () => {
        setPopupOpen(true);
    }
    const deleteSong = () => {
        if(!song)return;
        handleApiCall(songsApi.songsControllerDelete(song.guid))
        .then((r)=>{
            afterClick();
        })
        .catch((e)=>{
            console.log(e);
        })
    }

    return (
        <>
            {!loading&&<Card sx={{marginTop:1}}>
                <CardContent>
                    <Typography fontWeight={"bold"}>{getName()}</Typography>
                    <Button onClick={show}>Ukázat</Button>
                    <Button onClick={verify}>Ověřit</Button>
                    {isAdmin()&&<Button onClick={openDeletePopup}>Smazat</Button>}
                    
                </CardContent>
            </Card>}

            <Dialog
                open={popupOpen}
                onClose={closePopup}>
                <DialogTitle>
                    {"Opravdu chceš smazat tento záznam?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Píseň by byla smazána s databáze. Tento krok nepůjde vrátit.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Ponechat</Button>
                    <Button onClick={deleteSong} autoFocus>
                        Smazat
                    </Button>
                </DialogActions>
            </Dialog>
        </>    
    )
}
