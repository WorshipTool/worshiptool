import { Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, TextField, Typography, styled } from "@mui/material";
import Toolbar from "../../components/Toolbars/Toolbar";
import { PlaylistDataDTO, GetPlaylistsResultDTO, PostCreatePlaylistBodyDTO, PostCreatePlaylistResultDTO } from '../../api/dtos/playlist/dtosPlaylist';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlaylists from "../../hooks/playlist/usePlaylists";
import { Add, Remove } from "@mui/icons-material";
import useCurrentPlaylist from "../../hooks/playlist/useCurrentPlaylist";
import AppContainer from "../../components/AppContainer/AppContainer";
import Gap from "../../components/Gap";
import { LoadingButton } from "@mui/lab";
import AxiosResponse from 'axios';
import { useApiStateEffect } from "../../tech/ApiState";



const StyledContainer = styled(Paper)(({theme})=>({
    backgroundColor: theme.palette.grey[100],

    padding: "0.5rem",
    // borderRadius:"0.5rem",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        // boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer",
    // borderWidth:1.4,
    // borderStyle: "solid"
}))


export default function () {

    // const [playlists, setPlaylists] = useState<PlaylistDataDTO[]>([]);

    const inputRef = useRef();

    const [titleDialogOpen, setTitleDialogOpen] = useState(false);


    const {getPlaylistsOfUser, createPlaylist: createWithName, deletePlaylist: deleteByGuid} = usePlaylists();
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const [createLoading, setCreateLoading] = useState(false);

    const [{
        data: playlists,
        loading,
        error
    }, reload] = useApiStateEffect(()=>{
        return getPlaylistsOfUser().then((r)=>{
            return r.playlists;
        });
    },[])

    // useEffect(()=>{
    //     reload()
    // },[]);

    useEffect(()=>{
        if(loaded) return;
        if(!loading) setLoaded(true);
    },[loading])

    // const reload = () =>{
    //     getPlaylistsOfUser()
    //     .then((result)=>{
    //         setPlaylists(result.playlists);
    //     }).catch((e : any)=>{
    //         setError(e.message)
    //     })
    // }
    
    const {guid : playlistGuid, turnOn, turnOff} = useCurrentPlaylist();

    const onCreateClick = () => {
        setCreateLoading(true);
        createPlaylist();
    }

    const createPlaylist = async () => {
        const curr : any = inputRef.current;
        try{
            const result = await createWithName("Nový playlist " + playlists?.length);
            navigate("/playlist/"+result.guid);
            turnOn(result.guid)
        }catch(e : any){
            console.log("Something went wrong:", e.message);
            setCreateLoading(false);
        }
        // if(isRequestSuccess(result)){
        // }else{
        //     console.log("Something went wrong:", result.message);
        //     setCreateLoading(false);
        // }

    }


    const deletePlaylist = async (guid:string) => {
        if(playlistGuid===guid) turnOff();
        deleteByGuid(guid)
        .then((result)=>{
            reload();
        }).catch((e : any)=>{
            console.log("Something went wrong:", e.message)
        })
    }

    const openPlaylist = (guid:string) => {
        navigate("/playlist/"+guid);

    }   
    const {isOn, guid: currentPlaylistGuid} = useCurrentPlaylist();
      
    const ListPlaylistItem = ({name, guid}:{name:string, guid:string}) => {
        return <StyledContainer sx={{padding: 0, marginBottom:1,display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Button onClick={()=>openPlaylist(guid)} fullWidth color="warning" >
                {name}
            </Button>
            <IconButton>
                <Remove onClick={()=>deletePlaylist(guid)}/>
            </IconButton>
            <Box position={"absolute"} marginLeft={1}>
            {isOn&& (currentPlaylistGuid == guid) ? <Chip label={"Aktivní"} size='small' color='secondary'/> : <></>}
            </Box>
        </StyledContainer>
    }

    return <>

        <AppContainer>
            <Box display={"flex"} justifyContent={"center"}>
                <Box sx={{maxWidth:500, marginTop:7}} flex={1}>
                    {error?<>
                        <Typography>Při načítání nastala chyba.</Typography>
                        <Typography>{error.message}</Typography>
                    </>:<></>}
                    <Box display={"flex"} marginBottom={3}>
                        <Typography variant="h5" fontWeight={600} flex={1}>Moje playlisty:</Typography>

                        <LoadingButton 
                            loading={createLoading}
                            loadingPosition="start"
                            startIcon={<Add/>}
                            variant="contained" 
                            onClick={onCreateClick}>
                            Vytvořit
                        </LoadingButton>

                    </Box>
                    {!loaded? <Box sx={{
                        display:"flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex:1,
                        color: "black"
                    }}>
                        <Typography>Načítání playlistů...</Typography>
                        <Gap horizontal/>
                        <CircularProgress size={"2rem"} color="inherit"/>
                    </Box>:<>
                        
                        {playlists?.map((p)=>{
                            return <ListPlaylistItem name={p.title} guid={p.guid} key={p.guid}/>
                        })}

                        
                        {playlists?.length==0&&<>
                            <Typography>Nemáš žádný vytvořený playlist.</Typography>
                        </>}
                    </>}


                </Box>
            </Box>

            <Dialog open={titleDialogOpen} onClose={()=>setTitleDialogOpen(false)}>
                <DialogTitle>Vytvořit playlist</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Název playlistu"   
                        helperText="Zadejte název playlistu"     
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={inputRef}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setTitleDialogOpen(false)}>Zrušit</Button>
                <Button onClick={createPlaylist}>Vytvořit</Button>
                </DialogActions>
            </Dialog>

        </AppContainer>

    </>
}