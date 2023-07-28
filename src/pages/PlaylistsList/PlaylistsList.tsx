import { Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, TextField, Typography, styled } from "@mui/material";
import Toolbar from "../../components/Toolbars/Toolbar";
import { PlaylistDataDTO, GetPlaylistsResultDTO, PostCreatePlaylistBodyDTO, PostCreatePlaylistResultDTO } from '../../apis/dtos/playlist/dtosPlaylist';
import { useEffect, useRef, useState } from "react";
import useFetch from '../../hooks/useFetch';
import { getUrl_GETPLAYLISTS, getUrl_POSTCREATEPLAYLIST } from '../../apis/urls';
import { isRequestSuccess, RequestResult, isRequestError } from '../../apis/dtos/RequestResult';
import { useNavigate } from "react-router-dom";
import usePlaylists from "../../hooks/playlist/usePlaylists";
import { Remove } from "@mui/icons-material";
import useCurrentPlaylist from "../../hooks/playlist/useCurrentPlaylist";
import AppContainer from "../../components/AppContainer/AppContainer";



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

    const [playlists, setPlaylists] = useState<PlaylistDataDTO[]>([]);
    const [result, setResult] = useState<RequestResult<any>|undefined>(undefined);

    const inputRef = useRef();

    const [titleDialogOpen, setTitleDialogOpen] = useState(false);

    const {fetchData, post} = useFetch()

    const {getPlaylistsOfUser, createPlaylist: createWithName, deletePlaylist: deleteByGuid} = usePlaylists();

    const navigate = useNavigate();

    useEffect(()=>{
        reload();
    },[]);

    const reload = () =>{
        getPlaylistsOfUser()
        .then((result)=>{
            setResult(result);
            if(isRequestSuccess(result)){
                setPlaylists(result.data.playlists);
            }
        })
    }
    
    const {guid : playlistGuid, turnOn, turnOff} = useCurrentPlaylist();

    const onCreateClick = () => {
        setTitleDialogOpen(true);
    }

    const createPlaylist = async () => {
        const curr : any = inputRef.current;
        const result = await createWithName(curr.value);
        if(isRequestSuccess(result)){
            navigate("/playlist/"+result.data.guid);
            turnOn(result.data.guid)
        }else{
            console.log("Something went wrong:", result.message);
        }
    }


    const deletePlaylist = async (guid:string) => {
        const result = await deleteByGuid(guid);
        if(playlistGuid===guid) turnOff();
        if(isRequestSuccess(result)){
            reload();
        }else{
            console.log("Something went wrong:", result.message)
        }
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
        {/* <Toolbar/> */}

        <AppContainer>
            <Box display={"flex"} justifyContent={"center"}>
                <Box sx={{maxWidth:500, marginTop:7}} flex={1}>
                    {result&&isRequestError(result)?<>
                        <Typography>Při načítání nastala chyba.</Typography>
                        <Typography>{result.message}</Typography>
                    </>:<></>}
                    <Box display={"flex"} marginBottom={3}>
                        <Typography variant="h5" fontWeight={600} flex={1}>Moje playlisty:</Typography>
                        <Button variant="contained" onClick={onCreateClick}>Vytvořit</Button>
                    </Box>
                    {playlists.map((p)=>{
                        return <ListPlaylistItem name={p.title} guid={p.guid}/>
                    })}
                    {playlists.length==0&&<>
                        <Typography>Nemáš žádný vytvořený playlist.</Typography>
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