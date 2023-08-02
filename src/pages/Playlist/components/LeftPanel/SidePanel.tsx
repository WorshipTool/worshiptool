import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, InputBase, Switch, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist';
import useInnerPlaylist from '../../hooks/useInnerPlaylist';
import useAuth from '../../../../hooks/auth/useAuth';
import OnChangeDelayer from '../../../../components/ChangeDelayer';
import Gap from '../../../../components/Gap';
import { Dashboard, Edit } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import PanelItem from './PanelItem';
import { useNavigate } from 'react-router-dom';
import useGroup from '../../../../hooks/group/useGroup';

const Container = styled(Box)(({theme})=>({
    width: 300,
    backgroundColor: theme.palette.grey[100],
    // backgroundColor:"red",
    boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
    height: "calc(100vh - 56px)",
    position: "sticky",
    top:56,
    // maxHeight: "calc(100vh - 56px)",
}))


export default function SidePanel({onCardsClick}
            : {onCardsClick : ()=>void}) {


    const {isOn, guid: currentPlaylistGuid} = useCurrentPlaylist();
    const {rename, playlist, items, guid: playlistGuid} = useInnerPlaylist();

    const {isOn: isGroupOn} = useGroup();

    const [title, setTitle] = useState<string>("");

    const {isLoggedIn, user} = useAuth();

    const isOwner = useMemo(()=>isLoggedIn(), [isLoggedIn]);

    const navigate = useNavigate();

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

    const openCards = () => {
        navigate("/playlist/"+playlistGuid+"/cards");
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
            <Box margin={2}  maxHeight={`calc(100vh - ${theme.spacing(4)} - 56px)`} display={"flex"} flexDirection={"column"}>
                
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
                </Box>
                <Gap/>
                {items.length==0&&<>
                    <Typography variant='subtitle2'>V playlistu nejsou žádné písně...</Typography>
                </>}
               <Box  flex={1} display={"flex"} flexDirection={"column"} alignItems={"center"} bgcolor={theme.palette.grey[100]} sx={{
                     "&::-webkit-scrollbar": {
                        display: "auto",
                    },
                    paddingTop: 1,
                    paddingBottom: 8,
                    overflowY: "auto"
               }}>
                    
                    <Masonry columns={1} >
                        {items.map((item)=>{
                            return <PanelItem item={item} key={"order_"+item.guid} onClick={()=>onPanelItemClickCall(item.guid)}/>
                        })}
                    </Masonry>
               </Box>
            </Box>
            
            <Box sx={{
                    position:"absolute",
                    bottom: 30,
                    right: 30,
                    left: 30,
                    displayPrint:"none",
                    pointerEvents:"none"
                }}
                display={"flex"} justifyContent={"space-between"} >
                    
                {items.length>0?<Box  sx={{pointerEvents:"auto"}}>
                    <Button variant='contained' startIcon={<Dashboard/>} onClick={openCards}
                        color={isGroupOn?"secondary": "primary"}>
                        Karty
                    </Button>

                </Box>:<Box/>}
                <Button variant="contained"  onClick={onPrint} sx={{pointerEvents:"auto"}}>Vytisknout</Button>

            </Box>


        </Container>
    )
}
