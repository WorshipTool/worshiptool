import { Box, Button, IconButton, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSong from '../../hooks/song/useSong';
import DefaultStyle from './styles/DefaultStyle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useAuth from '../../hooks/auth/useAuth';
import { ROLES } from '../../models/user';
import useFetch from '../../hooks/useFetch';
import { getUrl_DELETEVARIANT, getUrl_UNVERIFYVARIANT, getUrl_VERIFYVARIANT } from '../../backend/urls';
import Toolbar from '../../components/Toolbar';
import { useSnackbar } from 'notistack';
import useStack from '../../hooks/playlist/useStack';
import { AddBoxRounded, Print, PrintRounded } from '@mui/icons-material';
import Gap from '../../components/Gap';
import TransposePanel from './TransposePanel';


export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const {setGUID, song, getTransposedVariant, transpose, reload, getName, loading} = useSong(null);
    const {user, isTrustee, isAdmin, isLoggedIn} = useAuth();
    const {post} = useFetch();

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const {add, remove: removeFromPlaylist, contains} = useStack();

    useEffect(()=>{
        if(guid) setGUID(guid);
        else{

        }
    },[]);

    useEffect(()=>{
      if(song!==undefined)      
        document.title = getName();
    },[getName])


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
        enqueueSnackbar(`Ověření písně ${getName()} bylo zrušeno`);
      });
    }
  }
  const verify = () => {
    if(guid&&song){
      post({url: getUrl_VERIFYVARIANT(song.variants[0].guid)},()=>{
        reload();
        enqueueSnackbar(`Píseň ${getName()} byla ověřena.`);
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
    add(guid);
  }
  const onPlaylistRemoveClick = () => {
    
    if(guid===undefined)return;
    removeFromPlaylist(guid);
  }

  const onPrintClick = () => {
    window.print();
  }

  return (
    <>
      <Toolbar transparent={false}/>
      <Box flex={1} display={"flex"} flexDirection={"row"}>
        <Box sx={{flex:1, display:"flex", flexDirection:"column"}}>
            <Box sx={styledContainerSX} displayPrint={"none"}> 
                <Box display={"flex"} flexDirection={"row"}>
                  <Box flex={1} display={"flex"} flexDirection={"row"}>
                    <TransposePanel transpose={transpose}/>
                    <Gap vertical/>
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
  
                    
                  <Button endIcon={<Print/>} variant='outlined' color="primary" onClick={onPrintClick}>Tisknout</Button>
                </Box>
                <Gap value={2}/>
                {song&&!loading?<DefaultStyle song={song} variant={getTransposedVariant(0)}/>
                :<>
                {Array(10).fill(0).map(()=>{
                  return <Skeleton variant={"text"} width={Math.round(Math.random()*50)+"%"}></Skeleton>
                })}
                </>}
            </Box>
    
            {<Box sx={{ displayPrint: "flex",
              flex:1,
              display:"none",
              flexDirection: "column"}}>
                {song&&<DefaultStyle song={song} variant={getTransposedVariant(0)}/>} 
            </Box>}
            
    
        </Box>




        {isLoggedIn()&&<Box sx={{
                position: "fixed",
                bottom:30,
                right: 30
              }} display={"flex"} flexDirection={"column"} displayPrint={"none"}>

          {guid&&!contains(guid)?
            <>
              <Button onClick={onPlaylistAddClick} variant="contained">Přidat do playlistu</Button>
            </>
            :<>              
                <Typography variant='subtitle2'>Tato píseň je v playlistu</Typography>
                <Button onClick={onPlaylistRemoveClick} variant="contained">Odstranit z playlistu</Button>
            </>}
          </Box>}
        

      </Box>
    </>
  
  )
}
