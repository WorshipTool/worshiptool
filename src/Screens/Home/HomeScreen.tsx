import { alpha, AppBar, Box, Button, ButtonGroup, Card, CardActions, CardContent, Paper, styled, Toolbar, Typography } from '@mui/material'
import InputBase from '@mui/material/InputBase'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TypeFormatFlags } from 'typescript'
import { SERVER_URL } from '../../Data/database/Constants'
import { IDBAllSongData, IDBSongDataArray} from '../../Data/database/interfaces'
import Song, { CreateSongFromIDBAll } from '../../Data/Song/Song'
import AddSongScreen from '../AddSong/AddSongScreen'
import "./HomeScreen.css"

export default function HomeScreen() {

  const StyledTitle = styled(Typography)(({theme})=>({
    color: alpha(theme.palette.common.black,0.9),
    textTransform:"uppercase",
    fontWeight: "light",
    fontFamily:"Rubik Spray Paint",
    margin: 10
  }))

  const Search = styled(ButtonGroup)(({theme})=>({
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.black,
    backgroundColor: alpha(theme.palette.common.white,0.8),
    '&:hover':{
      backgroundColor: alpha(theme.palette.common.white,0.81)
    },
    display:"flex",
    borderStyle: "solid",
    borderWidth:"1px",
    borderColor: alpha(theme.palette.common.black, 0.5),
    maxWidth:"600px",
    margin: 10,
  }));

  const SearchInput = styled(InputBase)(({})=>({
    padding:7,
    paddingLeft:10,
    flex:1
  }))

  const SearchButton = styled(Button)(({theme})=>({
    background: `linear-gradient(70deg, ${alpha(theme.palette.common.white,0.8)} 30%, ${alpha(theme.palette.common.white,0.5)} 90%)`,
    borderRadius: `0px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0px`
  }))

  const [songs, setSongs] = useState<Song[]>([]);

  return (
    <Box>
      <Box sx={{backdropFilter:"blur(50px)", height: "100vh"}}>
        <AppBar position='static'>
          <Toolbar>

          </Toolbar>
        </AppBar>

        <Box sx={{width:"100%"}} display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <StyledTitle variant='h2'>Najdi si to rychle</StyledTitle>
          <Search>
            <SearchInput placeholder='Zadej nazev, nebo autora písničky'></SearchInput>
            <SearchButton>Hledej</SearchButton>
          </Search>
            
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={1} alignItems={"center"}>
          {songs.map((song)=>{
            return (
              <Paper sx={{maxWidth:"300px", padding:2}} elevation={3}>
                
                  <Typography fontWeight={"bold"}>{song.name}</Typography>      
                  
                {/* <Link to={"song/" + song} >
                  <Button>Zobraz</Button>
                </Link> */}
                    
              </Paper>
            )
          })}
        </Box>
        

      </Box>
      
    </Box>
  )
}
