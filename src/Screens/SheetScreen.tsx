import { AppBar, Box, Button, ButtonGroup, InputBase, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material'
import { alpha, Container } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SheetComponent from '../Components/SheetComponent'
import { SERVER_URL } from '../database/Constants'
import { IDBAllSongData } from '../database/interfaces'
import Song, { CreateSongFromIDBAll } from '../database/Song'
import Image from './../Images/islandincloudsbg.jpg'

export default function SheetScreen() {

    let {guid} = useParams();

    if(guid===undefined){
        return (
            <Typography>Neplatne vstup</Typography>
        )
    }

    const [value, setValue] = useState<string>(guid);
    const [song, setSong] = useState<Song>();

    const [found, setFound] = useState(true);
    const [variant, setVariant] = useState<number>();
    

    
    const show = () =>{
        const url = SERVER_URL+"/songs/"+value;
        fetch(url)
        .then((response:any)=>{

            setFound(!(response.status >= 400));

            return response.json();
        }).then((data: IDBAllSongData)=>{

            if(!data.song){
                return;
            }

            const s = CreateSongFromIDBAll(data);
            setSong(s);
            
            if(s===undefined)return;
            if(s.variants.length>0) setVariant(0);
        })
    }

    const onValueChange = (event : any) =>{
        setValue(event.target.value);
    }

    useEffect(()=>{
        if(found) show();
    },[]);

  return (
    <>
        <Box sx={{backgroundImage: `url(${Image})`, backgroundSize: "cover", height: "100vh"}}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography>Worship Tool</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth={"md"} sx={{backgroundColor: `rgba(255,255,255,1)`}} >
                <ButtonGroup size="small" sx={{margin:1, marginLeft:-2}} variant={"outlined"}>
                    {song&&song.variants.map((variant, index)=>{
                        return (
                            <Button onClick={()=>{
                                setVariant(index);
                            }}>{index+1}</Button>
                        )
                    })}
                </ButtonGroup>
                <Box p={5}>

                    
                    

                    {found?
                        <SheetComponent song={song} variant={variant}/>
                        :
                        <Typography>Not found.</Typography>}
                </Box>
            </Container>
    
        
        </Box>
    </>
  )
}
