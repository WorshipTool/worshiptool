import React, { useEffect, useState } from 'react'
import { alpha, Box, Card, CardContent, CardActions, Container, InputBase, Stack, styled, TextField, Typography, Button , ListItem, Paper} from '@mui/material'
import Image from "./Images/desertbg.jpg"
import SearchIcon from "@mui/icons-material/Search"
import Song from './Data/Song/Song';


const endUrl = "http://localhost:3000/";

export default function SearchScreen() {

  const Search = styled('div')(({theme})=>({
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.black,
    backgroundColor: alpha(theme.palette.common.white,0.7),
    '&:hover':{
      backgroundColor: alpha(theme.palette.common.white,0.8)
    },
    position:"relative",
  }));

  const IconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0,2),
    position:"absolute",
    display:"flex",
    height:"100%",
    justifyContent: "center",
    alignItems:"center",
  }));

  const SearchInput = styled(InputBase)(({theme})=>({
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
  }));

  const [songs, setSongs] : [Song[], any] = useState([]);

  // useEffect(()=>{
  //   fetch(endUrl+"get")
  //   .then((response:any)=>{
  //     return response.json();
  //   }).then((data: Song)=>{
  //     //console.log(data);
  //     setSongs(data);
  //   })
  // },[]);
  
  return (
    <Box sx={{
      backgroundImage: `url(${Image})`,
      backgroundSize: "cover",
      backgroundPosition: "up"
    }}>
      <Container maxWidth={"md"} sx={{ height: "100vh", display:"flex", flexDirection:"row", justifyContent:"center", gap:2}}>
        <Box flexDirection={"column"} gap={2} sx={{display:"flex"}} flex={2} justifyContent={"center"}>
          <Typography variant='h2'>Nenech se rušit, ponoř se!</Typography>
          <Search>
            <IconWrapper>
              <SearchIcon/>
            </IconWrapper>
            <SearchInput placeholder='Hledej...'/>
          </Search>
        </Box>

        <Stack flex={2} p={5} gap={1} sx={{overflow:'auto', marginY: 10}}>

            
            {
              songs.map((song:Song, index: number)=>{
                return(
                  <Paper key={index}>
                    <Card>
                      <CardContent>

                        <Typography variant='h6'>{song.name}</Typography>  
                        <Typography variant='h6'>{song.creators[0].name}</Typography>  
                        <Typography >We do not know text or melody. Create your own. </Typography>  

                      </CardContent>
                      <CardActions>
                        <Button size='small'>Open sheet</Button>
                      </CardActions>
                    </Card>
                  </Paper>
                  
                );
              })
            }
        </Stack>

      </Container>

    </Box>
  )
}
