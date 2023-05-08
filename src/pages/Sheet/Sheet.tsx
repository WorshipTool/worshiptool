import { Box, Button, Chip, IconButton, MenuItem, Select, SelectChangeEvent, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
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
import { Add, AddBoxRounded, CopyAll, Print, PrintRounded, Tag, VerifiedUser, VideoFile } from '@mui/icons-material';
import Gap from '../../components/Gap';
import TransposePanel from './TransposePanel';
import YoutubeVideo from '../../components/YoutubeVideo';
import { MediaTypes } from '../../models/song/media';
import AddVideo from '../../components/AddVideo';
import { SourceTypes } from '../../models/song/source';
import AddTag from '../../components/AddTag';
import AddCreator from '../../components/AddCreator';


export default function Sheet() {
    const {guid} = useParams();
    const theme = useTheme();

    const [variantID, setVariantID] = useState(0);

    const {setGUID, song, getTransposedVariant, transpose, reload, getName, loading} = useSong(null);
    const {user, isTrustee, isAdmin, isLoggedIn} = useAuth();
    const {post} = useFetch();

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const {add, remove: removeFromPlaylist, contains} = useStack();

    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addCreatorOpen, setAddCreatorOpen] = useState(false);

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

  const addVideo = () => {
    setAddVideoOpen(true);
  }
  const addTag = () => {
    setAddTagOpen(true);
  }

  const onVariantSelectChange = (event: SelectChangeEvent) => {
    setVariantID(+event.target.value)
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
                    <Gap horizontal/>
                    {song&&song.variants.length>0&&(
                      <>
                        {user&&user.role==ROLES.Admin&&song?.variants[0].verified&&
                          <Button onClick={unverify}>Zrušit ověření</Button>
                        }
                        {user&&(isTrustee()||isAdmin())&&!song?.variants[0].verified&&
                          <>
                            <Button onClick={verify}>Ověřit</Button>
                            {isAdmin()&&<Button onClick={remove}>Smazat</Button>}
                          </>
                        }
                        <Select
                          value={variantID + ""}
                          onChange={onVariantSelectChange}>
                            {song.variants.map((v, index)=>{
                              return <MenuItem value={index}>{v.preferredTitle || (index+"")}</MenuItem>
                            })}
                        </Select>
                      </>
                    )}
                    
                  </Box>
  
                  {isAdmin()&&<IconButton onClick={()=>{navigator.clipboard.writeText(getTransposedVariant(variantID).sheetData)}}>
                    <CopyAll/>  
                  </IconButton>}
                  {isAdmin()&&<Button endIcon={<Add/>} variant='text' color="primary" onClick={()=>navigate("/create/"+guid)}>Přidat variantu</Button>}
                  <Gap horizontal={true}/>
                  {isAdmin()&&<Button endIcon={<VerifiedUser/>} variant='text' color="primary" onClick={()=>setAddCreatorOpen(true)}>Přidat autora</Button>}
                  <Gap horizontal={true}/>
                  {isAdmin()&&<Button endIcon={<VideoFile/>} variant='text' color="primary" onClick={addVideo}>Přidat video</Button>}
                  <Gap horizontal={true}/>
                  {isAdmin()&&<Button endIcon={<Tag/>} variant='text' color="primary" onClick={addTag}>Přidat tag</Button>}
                  <Gap horizontal={true}/>
                  <Button endIcon={<Print/>} variant="outlined" color="primary" onClick={onPrintClick}>Tisknout</Button>
                </Box>
                <Gap value={2}/>
                {song&&!loading?<DefaultStyle song={song} variant={getTransposedVariant(variantID)}/>
                :<>
                {Array(10).fill(0).map(()=>{
                  return <Skeleton variant={"text"} width={Math.round(Math.random()*50)+"%"}></Skeleton>
                })}
                </>}

                {isAdmin()&&song&&<>                
                  {song.media.map((m)=>{
                    if(m.type===MediaTypes.Youtube){
                      return <YoutubeVideo src={m.url}></YoutubeVideo>
                    }else{
                      return <Typography>Našli jsme přílohu, ale nevíme jak si s ní poradit.</Typography>
                    }
                  })}
                  <Gap/>
                </>}

                <Box>
  
                  {song?.variants?.[variantID]?.sources&&song.variants[variantID].sources.length>0&&<>
                    <Typography variant='subtitle2'>Zdroje</Typography>
                    <Box display={"flex"} flexDirection={"row"} gap={0.5}>
                      {song.variants[variantID].sources.map((s)=>{
                        if(s.type==SourceTypes.Url){
                          
                          const onClick = ()=>{
                            window.open(s.value, '_blank', 'noreferrer');
                          }
                          return <>
                            <Chip label={s.value} onClick={onClick} sx={{cursor: "pointer"}}/>
                          </>
                        }
                        return <>
                          <Chip label={s.value}/>
                        </>
                      })}
                    </Box >
                    <Gap/>
                  </>}
                  {isAdmin()&&song?.tags&&song.tags.length>0&&<>
                    <Typography variant='subtitle2'>Tagy</Typography>
                    <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} gap={0.5}>
                      {song.tags.map((s)=>{
                        return <Chip label={s}/>
                      })}                      
                    </Box >
                    <Gap/>
                  </>}
                  {isAdmin()&&song&&song.creators&&song.creators.length>0&&<>
                    <Typography variant='subtitle2'>Autoři</Typography>
                    <Box display={"flex"} flexDirection={"row"} gap={0.5}>
                      {song.creators.map((s)=>{
                        return <Chip label={s.name}/>
                      })}
                    </Box >
                  </>}
                </Box>
            </Box>
    
            {<Box sx={{ displayPrint: "flex",
              flex:1,
              display:"none",
              flexDirection: "column"}}>
                {song&&<DefaultStyle song={song} variant={getTransposedVariant(variantID)}/>} 
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

      <AddVideo open={addVideoOpen} handleClose={()=>setAddVideoOpen(false)} songGuid={guid} afterUpload={()=>{
        reload();
      }}/>
      <AddTag open={addTagOpen} handleClose={()=>setAddTagOpen(false)} songGuid={guid} afterUpload={()=>{
        reload();
      }}/>
      <AddCreator open={addCreatorOpen} handleClose={()=>setAddCreatorOpen(false)} songGuid={guid} afterUpload={()=>{
        reload();
      }}/>
    </>
  
  )
}
