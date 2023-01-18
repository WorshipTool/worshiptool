import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useSong from '../../hooks/useSong';
import DefaultStyle from './styles/DefaultStyle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useAuth from '../../hooks/auth/useAuth';
import { ROLES } from '../../models/user';
import useFetch from '../../hooks/useFetch';
import { getUrl_UNVERIFYVARIANT } from '../../backend/urls';
import Toolbar from '../../components/Toolbar';

export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const {setGUID, song, getTransposedVariant, transpose} = useSong(null);
    const {user} = useAuth();
    const {post} = useFetch();

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

  const unverify = () => {
    if(guid&&song){
      post({url: getUrl_UNVERIFYVARIANT(song.variants[0].guid)});
    }
  }

  return (
    <>
      <Toolbar transparent={false}/>
      <Box sx={{flex:1, display:"flex", flexDirection:"column"}}>
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
                {user&&user.role==ROLES.Admin&&
                  <Button onClick={unverify}>Zrušit ověření</Button>
                }
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
    </>
  
  )
}
