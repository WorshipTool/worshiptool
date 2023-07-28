import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Switch, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import Gap from '../../../components/Gap'
import { Masonry } from '@mui/lab'
import { Dashboard, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import useSong from '../../../hooks/song/useSong'
import useStack from '../../../hooks/playlist/useStack'
import PanelItem from '../PanelItem'
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist'
import Playlist from '../../../interfaces/playlist/playlist'
import useInnerPlaylist from '../hooks/useInnerPlaylist'


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


    const [popupOpen, setPopupOpen] = useState(false);

    const closePopup = () => {
        setPopupOpen(false);
    }

    const openPopup = () => {
        setPopupOpen(true);
    }



    const removeAll = () => {
        // setGUIDs([]);
        closePopup();
    }

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

    const {isOn, guid: currentPlaylistGuid} = useCurrentPlaylist();

    return (
        <Container displayPrint={"none"}>
            <Box margin={2}>
                
                <Box display={"flex"} flexDirection={"row"}>
                    <Typography variant='h5' fontWeight={"bold"} flex={1}>{playlist?.title}</Typography>
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

            <Dialog
                open={popupOpen}
                onClose={closePopup}>
                <DialogTitle>
                    {"Opravdu chceš vyprázdnit celý playlist?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Po potvrzení budou všechny písně z playlistu odstraněny a on tak zůstane prázdný.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Vše ponechat</Button>
                    <Button onClick={removeAll} autoFocus>
                        Odebrat vše
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}
