import React, { useRef, useState } from 'react'
import useYoutube from '../hooks/useYoutube';
import { NewSongDataDTO, NewSongDataResult } from '../backend/dtos/dtosNewSongData';
import { MediaTypes } from '../models/song/media';
import { getUrl_ADDSONGDATA } from '../backend/urls';
import { RequestResult, isRequestSuccess } from '../backend/dtos/RequestResult';
import useFetch from '../hooks/useFetch';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { SourceTypes } from '../models/song/source';

interface AddSourceProps{
    open: boolean,
    handleClose: ()=>void,
    afterUpload?: (r:RequestResult<NewSongDataResult>)=>void,
    songGuid?:string
}

export default function AddSource({open, handleClose, afterUpload, songGuid}:AddSourceProps) {

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
        const value = inputRef.current.value;

        const dto : Partial<NewSongDataDTO> = {
            songGuid,
            source: [{
                type: SourceTypes.Url,
                value 
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
        <DialogTitle>Přidej zdroj</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Našel jsi na internetu nějakou píseň? Hoď nám sem odkaz ať jí můžeme přidat do databáze.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="source"
            label="Url zdroje"     
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
