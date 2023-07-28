import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, InputBase, Switch, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Gap from '../../../components/Gap'
import { Masonry } from '@mui/lab'
import { Dashboard, Edit, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import useSong from '../../../hooks/song/useSong'
import useStack from '../../../hooks/playlist/useStack'
import PanelItem from '../PanelItem'
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist'
import Playlist from '../../../interfaces/playlist/playlist'
import useInnerPlaylist from '../hooks/useInnerPlaylist'
import OnChangeDelayer from '../../../components/ChangeDelayer'
import useAuth from '../../../hooks/auth/useAuth'


const Container = styled(Box)(({theme})=>({
    width: 300,
    backgroundColor: theme.palette.grey[100],
    boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
    height: "calc(100vh - 56px)",
    position: "sticky",
    top:56
}))


export default function SidePanel({playlist, variants, onCardsClick}
            : {playlist?:Playlist, variants:string[], onCardsClick : ()=>void}) {


    const {isOn, guid: currentPlaylistGuid} = useCurrentPlaylist();
    const {rename} = useInnerPlaylist();

    const [title, setTitle] = useState<string>("");

    const {isLoggedIn, user} = useAuth();

    const isOwner = useMemo(()=>isLoggedIn(), [playlist, isLoggedIn]);

    useEffect(()=>{
        setTitle(playlist?.title||"");
    },[playlist])

    const onTitleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
    }

    useEffect(()=>{
        if(title==="") setTitle(playlist?.title||"");
    },[playlist?.title])


    const onPrint = () => {
        window.print();
    }

    const onPanelItemClickCall = (guid:string)=>{
        const el = document.getElementById("playlistItem_"+guid);
        el?.scrollIntoView({
            behavior: "smooth", 
            block: "start"
        });
    }

    const inputRef = React.useRef<HTMLInputElement>(null);

    const focusTitle = () => {
        inputRef.current?.focus();
    }

    const theme = useTheme();


    return (
        <Container displayPrint={"none"}>
            <OnChangeDelayer value={title} onChange={()=>{
                if(!isOwner) return;
                if(title!==playlist?.title&&title!=="") rename(title);
            }} delay={800}/>
            <Box margin={2}>
                
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    {isOwner?
                        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{
                            borderRadius: 2,
                            marginRight:1,
                        }}>
                            <InputBase value={title} onChange={onTitleChange} sx={{
                                fontWeight: "bold",
                                fontSize: "1.4rem",
                                "&.Mui-focused": {
                                    backgroundColor: "white",
                                    paddingLeft:1,
                                    borderRadius: 2,
                                }
                            }} placeholder='Název playlistu' inputRef={inputRef}/>
                            <Gap horizontal/>
                            <IconButton onClick={focusTitle}>
                                <Edit/>
                            </IconButton>
                        </Box>
                        :
                        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                            
                            <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "1.4rem",
                            }} >{title}</Typography>
                        
                        </Box>}
                    {isOn&& (currentPlaylistGuid === playlist?.guid) ? <Chip label={"Aktivní"} size='small' color='secondary'/> : <></>}
                </Box>
                <Gap value={2}/>
                <Box display={"flex"} flexDirection={"row"}>
                    <Typography variant='h6' fontWeight={"bold"} flex={1}>Pořadí</Typography>
                    {/* <Button size="small" color='error' onClick={openPopup}>Odebrat vše</Button> */}
                </Box>
                <Gap/>
                {variants.length==0&&<>
                    <Typography variant='subtitle2'>V playlistu nejsou žádné písně...</Typography>
                </>}
                <Masonry columns={1}>
                    {variants.map((guid)=>{
                        return <PanelItem guid={guid} key={"order_"+guid} variants={variants} onClick={()=>onPanelItemClickCall(guid)}/>
                    })}
                </Masonry>
                <Gap value={6}/>
            </Box>
            
            <Box sx={{
                    position:"absolute",
                    bottom: 30,
                    right: 30,
                    left: 30,
                    displayPrint:"none"
                }}
                display={"flex"} justifyContent={"space-between"}>
                    
                <Box></Box>
                <Button variant="contained"  onClick={onPrint}>Vytisknout</Button>

            </Box>


        </Container>
    )
}
