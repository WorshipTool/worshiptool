import React, { useRef, useState } from 'react'
import useYoutube from '../hooks/useYoutube';
import { NewSongDataDTO, NewSongDataResult } from '../apis/dtos/dtosNewSongData';
import { MediaTypes } from '../interfaces/song/media';
import { getUrl_ADDSONGDATA } from '../apis/urls';
import { RequestResult, isRequestSuccess } from '../apis/dtos/RequestResult';
import useFetch from '../hooks/useFetch';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { SourceTypes } from '../interfaces/song/source';
import { CreatorType } from '../interfaces/song/creator';

interface AddCreatorProps{
    open: boolean,
    handleClose: ()=>void,
    afterUpload?: (r:RequestResult<NewSongDataResult>)=>void,
    songGuid?:string
}

export default function AddCreator({open, handleClose, afterUpload, songGuid}:AddCreatorProps) {

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
            creators: [{
              type: CreatorType.Author,
              name: value
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
        <DialogTitle>Přidej autora</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Znáš autora této písně?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="source"
            label="Jméno autora"     
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
