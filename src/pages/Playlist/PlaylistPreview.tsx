import { Box, Button, IconButton, Paper, Skeleton, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Toolbar from '../../components/Toolbar/Toolbar';
import DefaultStyle from '../Sheet/styles/DefaultStyle';
import useSong from '../../hooks/song/useSong';
import useStack from '../../hooks/playlist/useStack';
import { Add, KeyboardArrowDown, KeyboardArrowUp, Remove } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import { grey } from '@mui/material/colors';
import Gap from '../../components/Gap';
import ReactDOM from 'react-dom';
import SidePanel from './components/SidePanel';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { getUrl_GETSONGSINPLAYLIST } from '../../apis/urls';
import { GetSongsInPlaylistResultDTO } from '../../apis/dtos/playlist/dtosPlaylist';
import { isRequestSuccess } from '../../apis/dtos/RequestResult';
import usePlaylists from '../../hooks/playlist/usePlaylists';
import Playlist from '../../interfaces/playlist/playlist';
import usePlaylist from '../../hooks/playlist/usePlaylist';
import SlideCard from '../PlaylistCards/SlideCard/SlideCard';
import RightPanel from './components/RightPanel/RightPanel';

const Container = styled(Box)(({theme})=>({
    padding: 30
}))


const PageBreak = () => {
    return <Box sx={{
        pageBreakAfter: "always"
    }}>

    </Box>
}

const Item = ({guid, playlist,reload}:{guid:string, playlist:string,reload: ()=>void}) => {
    const {song, getTransposedVariant, transpose, loading} = useSong(guid);

    const {removeVariant, variants} = usePlaylist(playlist)


    const onRemove = () => {
        if(song&&song.variants.length>0) removeVariant(song.variants[0].guid).then(()=>reload())
    }

    if(song===undefined||loading)return <>
        <Skeleton variant='text' width={"50%"}></Skeleton>
        {Array(10).fill(0).map(()=><Skeleton variant='text' width={Math.round(Math.random()*40)+"%"}></Skeleton>)}
    
    </>
    return <>
                <Paper sx={{padding:2, marginBottom: 1, displayPrint: "none"}}>
                    <Box position={"absolute"} marginTop={-13} id={"playlistItem_"+guid}></Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Box>
                            <IconButton onClick={()=>{transpose(1);}}>
                                <Add/>
                            </IconButton>
                            <IconButton onClick={()=>{transpose(-1);}}>
                                <Remove/>
                            </IconButton>
                        </Box>
                        <Button variant='text' color='error' onClick={onRemove}>Odebrat z playlistu</Button>
                    </Box>
                    
                    <DefaultStyle song={song} variant={getTransposedVariant(0)}/>
                </Paper>
                
                <Box display={"none"} displayPrint={"block"}>
                    <DefaultStyle song={song} variant={getTransposedVariant(0)}/>
                    {variants.length>1&&<PageBreak/>}
                </Box>
            </>
}

export default function PlaylistPreview() {
    const {guid} = useParams();

    const {playlist, variants, reload} = usePlaylist(guid||"");

    const [searchOpen, setSearchOpen] = useState(false);


    const navigate = useNavigate();

    const onSearchClick = () => {
        setSearchOpen(true);
    }

    useEffect(()=>{
        document.title = "Playlist";

        if(!guid) return;

    },[])

    return (
        <Box>
            <Toolbar/>
            <Box display={"flex"} flexDirection={"row"}>                
                <SidePanel playlist={playlist} variants={variants.map((v)=>v.songGuid)} onCardsClick={()=>{
                    navigate("/playlist/cards/"+guid);
                }}/>
                <Box width={300} displayPrint={"none"}></Box>
                {<Container flex={1}>
                    
                    {searchOpen? <>
                        hledam
                    </>:<>
                        {variants.length==0&&<Box display={"flex"} flexDirection={"column"}  displayPrint={"none"}>
                            <Typography variant='subtitle1'>
                                V playlistu namáš zatím jedinou píseň. 
                            </Typography>
                            <Typography variant='subtitle1'>
                                Aby jsi mohl přidat píseň do playlistu, je třeba nejdřív nějakou najít...
                            </Typography>
                            <Gap/>
                            <Box>
                                <Button variant='contained' color='primary' onClick={onSearchClick}>Hledat</Button>
                            </Box>
                        </Box>}
                        {variants.map((g)=>{
                            return <Item guid={g.songGuid} key={g.songGuid} playlist={guid||""} reload={reload}/>
                        })}
                    </>}
                    
                </Container>}
                <RightPanel/>
                
    
            </Box>
        </Box>
    )
}
