import React, { useRef, useState } from 'react'
import useYoutube from '../hooks/useYoutube';
import { NewSongDataDTO, NewSongDataResult } from '../backend/dtos/dtosNewSongData';
import { MediaTypes } from '../models/song/media';
import { getUrl_ADDSONGDATA } from '../backend/urls';
import { RequestResult, isRequestSuccess } from '../backend/dtos/RequestResult';
import useFetch from '../hooks/useFetch';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

interface AddVideoProps{
    open: boolean,
    handleClose: ()=>void,
    afterUpload?: (r:RequestResult<NewSongDataResult>)=>void,
    songGuid?:string
}

export default function AddVideo({open, handleClose, afterUpload, songGuid}:AddVideoProps) {

    const inputRef = useRef();

    const {getId} = useYoutube();
    const {post} = useFetch();

    const [errorMessage, setErrorMessage] = useState("")

    const onClose = () => {
        setErrorMessage("");
        //@ts-ignore
        inputRef.current.value = "";
        handleClose();
    }

    const upload = () => {
        //@ts-ignore
        const url = inputRef.current.value;
        const id = getId(url);
        if(id==null){
            setErrorMessage("Neplatný formát URL")
            return;
        }

        const dto : Partial<NewSongDataDTO> = {
            songGuid,
            media: [{
                type: MediaTypes.Youtube,
                url: url
            }]
        }

        post({url: getUrl_ADDSONGDATA(), body: dto}, (d:RequestResult<NewSongDataResult>)=> {
            if(isRequestSuccess(d)){
                console.log(d);
                //added
                onClose();
                if(afterUpload) afterUpload(d);
            }else{
                setErrorMessage("Něco se pokazilo při nahrávání.")
            } 
        });
    }
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Přidej video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Našel jsi na Youtube video k této písni? Přidej ho. Jiné zdroje zatím nejsou podporovány.
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
            error={errorMessage!=""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Zrušit</Button>
          <Button onClick={upload}>Přidat</Button>
        </DialogActions>
      </Dialog>
  )
}
