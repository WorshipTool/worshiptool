import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useSong from '../../hooks/useSong';
import DefaultStyle from './styles/DefaultStyle';

export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const {setGUID, interface:song, getName, getText, getSheetData} = useSong(null);

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
            {song&&<DefaultStyle song={song}/>}
        </Box>

        <Box sx={{ displayPrint: "flex",
          flex:1,
          display:"none",
          flexDirection: "column"}}>
            {song&&<DefaultStyle song={song}/>} 
        </Box>
        

    </Box>
  
  )
}
