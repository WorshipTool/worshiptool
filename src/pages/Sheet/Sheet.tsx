import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useSong from '../../hooks/useSong';
import DefaultStyle from './styles/DefaultStyle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const {setGUID, interface:song, getTransposedVariant, transpose} = useSong(null);

    useEffect(()=>{
        if(guid) setGUID(guid);
        else{

        }
    },[]);


    const styledContainerSX = {
      [theme.breakpoints.down('md')]: {
        margin:0,
      },
      [theme.breakpoints.up('md')]: {
          margin:3,
      },
      padding:3,
      backgroundColor: theme.palette.grey[100],
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: theme.palette.grey[400],
      borderRadius: 1,
      flex:1,
      display:"flex",
      flexDirection: "column"
  }

  return (
    <Box sx={{flex:1, display:"flex", flexDirection:"column", height: "100vh"}}>
        
        <Box sx={styledContainerSX} displayPrint={"none"}> 
            <Box>
              <IconButton onClick={()=>{
                  transpose(1);
              }}>
                  <AddIcon/>
              </IconButton>
              <IconButton onClick={()=>{
                  transpose(-1);
              }}>
                  <RemoveIcon/>
              </IconButton>
            </Box>
            {song&&<DefaultStyle song={song} variant={getTransposedVariant(0)}/>}
        </Box>

        <Box sx={{ displayPrint: "flex",
          flex:1,
          display:"none",
          flexDirection: "column"}}>
            {song&&<DefaultStyle song={song} variant={getTransposedVariant(0)}/>} 
        </Box>
        

    </Box>
  
  )
}
