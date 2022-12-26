import { Box, Button, InputBase, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../../Data/database/Constants';

export default function AddSongScreen() {

  const [title, setTitle] = useState("");
  const [sheet, setSheet] = useState("");

  const navigate = useNavigate();

  const PostNewSong = async () => {

    const songObject = {title:title, sheetData: sheet};

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songObject)
  };

    const resolve = await fetch(SERVER_URL+"/songs", requestOptions);
    const json = await resolve.json();
    const guid = json.songGUID;
    navigate("/"+guid);


  }

  const onTitleChange = (event: any) => {
    setTitle(event.target.value);
  }
  const onSheetChange = (event: any) => {
    setSheet(event.target.value);
  }

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>

      <TextField placeholder='Název písně' 
        value={title} onChange={onTitleChange}></TextField> 
      <TextField multiline placeholder='Akordy a text (ve správném formátu)' sx={{flex:1}}
        value={sheet} onChange={onSheetChange}></TextField>
    
      <Button onClick={PostNewSong}>
        Vytvořit
      </Button>
      
    </Box>
  )
}
