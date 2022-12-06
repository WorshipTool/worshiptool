import { AppBar, Box, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material'
import { alpha, Container } from '@mui/system'
import React, { useState } from 'react'
import SheetComponent from '../Components/SheetComponent'
import Song from '../database/song'
import Image from './../Images/islandincloudsbg.jpg'
import TestSong from '../TestSong'

export default function SheetScreen() {

    const [tone, setTone] = useState("C");
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newTone: string,
      ) => {
        setTone(newTone);
      };

  return (
    <>
        <Box sx={{backgroundImage: `url(${Image})`, backgroundSize: "cover", height: "100vh"}}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography>Worship Tool</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth={"md"} sx={{backgroundColor: `rgba(255,255,255,1)`}} >
                <Box p={5}>
                    

                    <SheetComponent song={TestSong}/>
                </Box>
            </Container>
    
        
        </Box>
    </>
  )
}
