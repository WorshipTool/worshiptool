import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSong from '../../hooks/useSong';
import DefaultStyle from './styles/DefaultStyle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useAuth from '../../hooks/auth/useAuth';
import { ROLES } from '../../models/user';
import useFetch from '../../hooks/useFetch';
import { getUrl_DELETEVARIANT, getUrl_UNVERIFYVARIANT, getUrl_VERIFYVARIANT } from '../../backend/urls';
import Toolbar from '../../components/Toolbar';
import { useSnackbar } from 'notistack';
import Playlist from './Playlist';


export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const {setGUID, song, getTransposedVariant, transpose, reload} = useSong(null);
    const {user, isTrustee, isAdmin, isLoggedIn} = useAuth();
    const {post} = useFetch();

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

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
      post({url: getUrl_UNVERIFYVARIANT(song.variants[0].guid)},()=>{
        reload();
      });
    }
  }
  const verify = () => {
    if(guid&&song){
      post({url: getUrl_VERIFYVARIANT(song.variants[0].guid)},()=>{
        reload();
      });
    }
  }
  const remove = () => {
    if(guid&&song){
      post({url: getUrl_DELETEVARIANT(song.variants[0].guid)},()=>{
        navigate("/");
        enqueueSnackbar(`Píseň ${song.title} byla smazána.`);
      });
    }
  }

  const onPlaylistAddClick = () => {
    if(guid===undefined)return;

    const p = localStorage.getItem("playlist");
    let curr : string[] = [];
    if(p!=null) curr=JSON.parse(p);

    const newArr = [
      ...curr,
      guid
    ];

    localStorage.setItem("playlist", JSON.stringify(newArr));

  }

  return (
    <>
      <Toolbar transparent={false}/>
      <Box flex={1} display={"flex"} flexDirection={"row"}>
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
                  {user&&user.role==ROLES.Admin&&song?.variants[0].verified&&
                    <Button onClick={unverify}>Zrušit ověření</Button>
                  }
                  {user&&(isTrustee()||isAdmin())&&!song?.variants[0].verified&&
                    <>
                      <Button onClick={verify}>Ověřit</Button>
                      {isAdmin()&&<Button onClick={remove}>Smazat</Button>}
                    </>
                  }
                </Box>
                {song&&<DefaultStyle song={song} variant={getTransposedVariant(0)}/>}
            </Box>
    
            {<Box sx={{ displayPrint: "flex",
              flex:1,
              display:"none",
              flexDirection: "column"}}>
                {song&&<DefaultStyle song={song} variant={getTransposedVariant(0)}/>} 
            </Box>}
            
    
        </Box>
        {isLoggedIn()&&<Playlist onAdd={onPlaylistAddClick}/>}
      </Box>
    </>
  
  )
}
