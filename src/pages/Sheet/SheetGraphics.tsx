
import { Box, Button, ButtonGroup, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSong from '../../hooks/song/useSong';
import DefaultStyle from './styles/DefaultStyle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useAuth from '../../hooks/auth/useAuth';
import { ROLES } from '../../interfaces/user';
import useFetch from '../../hooks/useFetch';
import { getUrl_ADDSONGDATA, getUrl_DELETEVARIANT, getUrl_UNVERIFYVARIANT, getUrl_VERIFYVARIANT, getUrl_POSTADDTOPLAYLIST } from '../../api/urls';
import Toolbar from '../../components/Toolbars/Toolbar';
import { useSnackbar } from 'notistack';
import useStack from '../../hooks/playlist/useStack';
import { Add, AddBoxRounded, Check, CheckCircle, Close, CopyAll, Dashboard, Edit, LibraryMusic, MoreHoriz, MoreVert, PlaylistAdd, PlaylistAddCheck, PlaylistAddCircle, Print, PrintRounded, Tag, VerifiedUser, VideoFile } from '@mui/icons-material';
import Gap from '../../components/Gap';
import TransposePanel from './TransposePanel';
import YoutubeVideo from '../../components/YoutubeVideo';
import { MediaTypes } from '../../interfaces/song/media';
import AddVideo from '../../components/AddVideo';
import { SourceTypes } from '../../interfaces/song/source';
import AddTag from '../../components/AddTag';
import AddCreator from '../../components/AddCreator';
import { GetPlaylistsResultDTO, PostAddVariantToPlaylistBodyDTO } from '../../api/dtos/playlist/dtosPlaylist';
import { isRequestError, isRequestSuccess } from '../../api/dtos/RequestResult';
import Playlist from '../../interfaces/playlist/PlaylistDTO';
import usePlaylists from '../../hooks/playlist/usePlaylists';
import ContainerGrid from '../../components/ContainerGrid';
import AppContainer from '../../components/AppContainer/AppContainer';
import useGroup from '../../hooks/group/useGroup';
import useGroupSelection from '../../hooks/group/useGroupSelection';
import { ApiGroupDto } from '../../api/dtos/group/ApiGroupDto';
import useCurrentPlaylist from '../../hooks/playlist/useCurrentPlaylist';

import {Sheet} from "@pepavlin/sheet-api"
import AddToPlaylistButton from './components/AddToPlaylistButton';
import { VariantDTO } from '../../interfaces/variant/VariantDTO';
import SheetAdminButton from './components/SheetAdminButtons';
import SheetAdminButtons from './components/SheetAdminButtons';
import Song from '../../interfaces/song/song';


export default function SheetGraphics() {
    const {guid} = useParams();
    const theme = useTheme();


    const [variantID, setVariantID] = useState(0);

    const {setGUID, song, reload, getName, loading} = useSong(null);
    const {user, isTrustee, isAdmin, isLoggedIn} = useAuth();
    const {post} = useFetch();

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();


    const [currentSheet, setCurrentSheet] = useState<Sheet>();
    const [currentTransposition, setCurrentTransposition] = useState<number>(0);

    useEffect(()=>{
      if(song){
        console.log(song)
        const sheet = new Sheet(song.variants[variantID].sheetData);
        setCurrentSheet(sheet);
      }
    },[variantID, song])

    const transpose = (value:number) => {
      console.log("transpose", value);
      currentSheet?.transpose(value);
      setCurrentTransposition((prev)=>prev+value);
    }

    useEffect(()=>{
      if(currentSheet){
        currentSheet.setTransposition(currentTransposition);
      }
    },[currentTransposition])


    useEffect(()=>{
        if(guid){
          setGUID(guid);
        }
    },[]);




    useEffect(()=>{
      if(song!==undefined)      
        document.title = getName();
    },[getName])


    const styledContainerSX = {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding:theme.spacing(3),
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


  const {fetch, post: postData} = useFetch();
  const addTo13ka = async () => {
    const result = await fetch<ApiGroupDto>({url: "/group", params:{name:"13ka"}})
    if(isRequestSuccess(result)){
      const res2 = await postData({url: "/songs/playlist/add", body: {
        playlist: result.data.selection,
        variant: song?.variants[variantID].guid || ""
      }})

      if(isRequestSuccess(res2)){
        enqueueSnackbar("Píseň byla přidána do 13ky");
        return;
      }else{
        enqueueSnackbar("\""+res2.message+"\"");
        return;
      }
    }
    enqueueSnackbar("\""+result.message+"\"");

  }
  const removeFrom13ka = async () => {
    const result = await fetch<ApiGroupDto>({url: "/group", params:{name:"13ka"}})
    if(isRequestSuccess(result)){
      const res2 = await postData({url: "/songs/playlist/remove", body: {
        playlist: result.data.selection,
        variant: song?.variants[variantID].guid || ""
      }})

      if(isRequestSuccess(res2)){
        enqueueSnackbar("Píseň byla odebrána ze 13ky");
        return;
      }else{
        enqueueSnackbar("\""+res2.message+"\"");
        return;
      }
    }
    enqueueSnackbar("\""+result.message+"\"");

  }


  const onPrintClick = () => {
    window.print();
  }


  const onVariantSelectChange = (event: SelectChangeEvent) => {
    setVariantID(+event.target.value)
  }

  
  const currentPlaylist = useCurrentPlaylist();
  const isInCurrentPlaylist = useMemo(()=>{
    return currentPlaylist?.items.some((v)=>v.variant.guid===song?.variants[variantID].guid);
  },[currentPlaylist]);
  
  const addToCurrentPlaylist = () => {
    if(song){
      currentPlaylist.addVariant(song.variants[variantID].guid).then((d)=>{
        if(isRequestError(d)){
          currentPlaylist.reload();
        }
      });
    }
  }
  const removeFromCurrentPlaylist = () => {
    if(song){
      currentPlaylist.removeVariant(song.variants[variantID].guid).then((d)=>{
        if(isRequestError(d)){
          currentPlaylist.reload();
        }
      });
    }
  }
  const openPlaylist = () => {
    if(song){
      navigate("/playlist/"+currentPlaylist.guid);
    }
  }

  const {isOn} = useGroup();
  return (
    <AppContainer header={
      <Box display={"flex"} flexDirection={"row"}>
        {currentPlaylist.isOn&&isOn&&<>
            <ButtonGroup >
              <Button  color='secondary' size='small' variant='contained' onClick={openPlaylist}>Otevřít playlist</Button>
              {isInCurrentPlaylist?<>
                <Button color='error' variant='contained' size='small' onClick={removeFromCurrentPlaylist}>Odebrat z playlistu</Button>
              </>:<>
                <Button color='secondary' size='small' onClick={addToCurrentPlaylist}>Přidat do playlistu</Button>
              </>}
            </ButtonGroup>
        
        </>}
      </Box>
    }>
      <Box flex={1} display={"flex"} flexDirection={"row"}>
        <Box sx={{flex:1, display:"flex", flexDirection:"column", alignItems:"start"}}>
          <Box display={"flex"} width={"100%"} justifyContent={"center"}>
            <ContainerGrid sx={{...styledContainerSX, displayPrint: "none"}} direction='column'> 
                <Box display={"flex"} flexDirection={"row"}>
                  <Box flex={1} display={"flex"} flexDirection={"row"}>
                    <TransposePanel transpose={transpose}/>
                    <Gap horizontal/>

                    <Box display={"flex"} flex={1} flexDirection={"row"}sx={{
                      [theme.breakpoints.down("md")]: {
                        display: "none"
                      }
                    }}>
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
                          {isAdmin() && song.variants.length>1 && <Select
                            value={variantID + ""}
                            onChange={onVariantSelectChange}>
                              {song.variants.map((v, index)=>{
                                return <MenuItem value={index} key={index}>{v.preferredTitle || (index+"")}</MenuItem>
                              })}
                          </Select>}
                        </>
                      )}

                      <Box display={"flex"} flex={1} flexDirection={"row"} justifyContent={"end"}>

                          {isAdmin()&& 
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                              <Button variant="contained" size='small' color='secondary' onClick={removeFrom13ka}>Odebrat ze 13ky</Button>
                            </Box>}

                            <Gap horizontal={true}/>

                           {isAdmin()&& 
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                              <Button variant="contained" size='small' color='secondary' onClick={addTo13ka}>Do 13ky</Button>
                            </Box>}

                          {isAdmin()&&<>
                            <Gap horizontal={true}/>
                            <SheetAdminButtons sheet={currentSheet as Sheet} song={song as Song} reload={reload}/>
                            <Gap horizontal={true}/>
                          </>}


                      </Box>
                      
                    </Box>
    

                  </Box>

                  
                  {isLoggedIn()&&<AddToPlaylistButton variant={song?.variants[variantID] as VariantDTO}/>}
                  <Gap horizontal={true}/>
                  <Button endIcon={<Print/>} variant="outlined" color="primary" onClick={onPrintClick}>Tisknout</Button>
                </Box>
                <Gap value={2}/>
                {song&&!loading?<DefaultStyle title={getName()} sheet={currentSheet as Sheet}/>
                :<>
                {Array(10).fill(0).map((a,i)=>{
                  return <Skeleton variant={"text"} width={Math.round(Math.random()*50)+"%"} key={"skeleton"+i}></Skeleton>
                })}
                </>}

                {song&&<>                
                  {isLoggedIn()&&song.media.map((m)=>{
                    if(m.type===MediaTypes.Youtube){
                      return <YoutubeVideo src={m.url} key={m.url}></YoutubeVideo>
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
                            <Chip label={s.value} onClick={onClick} sx={{cursor: "pointer"}} key={s.value}/>
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
                        return <Chip label={s} key={s}/>
                      })}                      
                    </Box >
                    <Gap/>
                  </>}
                  {isAdmin()&&song&&song.creators&&song.creators.length>0&&<>
                    <Typography variant='subtitle2'>Autoři</Typography>
                    <Box display={"flex"} flexDirection={"row"} gap={0.5}>
                      {song.creators.map((s)=>{
                        return <Chip label={s.name} key={s.name}/>
                      })}
                    </Box >
                  </>}
                </Box>
            </ContainerGrid>

          </Box>
    
            {<Box sx={{ displayPrint: "flex",
              flex:1,
              display:"none",
              flexDirection: "column"}}>
                {song&&<DefaultStyle variantData={song.variants[variantID]} sheet={currentSheet as Sheet}/>} 
            </Box>}
            
    
        </Box>




        {isLoggedIn()&&<Box sx={{
                position: "fixed",
                bottom:30,
                right: 30
              }} display={"flex"} flexDirection={"column"} displayPrint={"none"}>

      
          </Box>}
        

      </Box>



    </AppContainer>
  
  )
}
